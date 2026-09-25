revoke execute on function public.assign_first_admin() from public, anon, authenticated;
revoke execute on function public.has_role(uuid, public.app_role) from public, anon;
alter table public.products rename column image_url to image_path;
create policy "Anyone can view product images" on storage.objects for select to anon, authenticated
  using (bucket_id = 'product-images');