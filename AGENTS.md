<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep forgotten-password recovery on the public `/reset-password` route and require authenticated, role-checked server functions for staff password changes, so locked-out owners can recover access without exposing privileged account changes.
- Keep storefront filters and contact destinations in a browser-safe catalog module; use registered product rows without commercial demo fallbacks to preserve catalog accuracy.
- Use Motion for transform/opacity animation with reduced-motion support, native scroll snapping for the mobile catalog, and Radix dialogs for accessible product details.
- Share the typographic Brand component across public and staff screens so rebrands cannot leave obsolete logos in account flows.
