CREATE OR REPLACE FUNCTION public.can_manage_products(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role in ('admin','staff'))
$$;
REVOKE EXECUTE ON FUNCTION public.can_manage_products(uuid) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.can_manage_products(uuid) TO authenticated;

DROP POLICY IF EXISTS "Admins insert products" ON public.products;
DROP POLICY IF EXISTS "Admins update products" ON public.products;
DROP POLICY IF EXISTS "Admins delete products" ON public.products;
CREATE POLICY "Team insert products" ON public.products FOR INSERT TO authenticated WITH CHECK (public.can_manage_products(auth.uid()));
CREATE POLICY "Team update products" ON public.products FOR UPDATE TO authenticated USING (public.can_manage_products(auth.uid()));
CREATE POLICY "Team delete products" ON public.products FOR DELETE TO authenticated USING (public.can_manage_products(auth.uid()));

CREATE POLICY "Team upload product images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'product-images' AND public.can_manage_products(auth.uid()));
CREATE POLICY "Team update product images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'product-images' AND public.can_manage_products(auth.uid()));
CREATE POLICY "Team delete product images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'product-images' AND public.can_manage_products(auth.uid()));