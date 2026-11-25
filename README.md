# ZL hoodie store

Next.js storefront, imported Three.js hoodie customizer, and password-only admin.

## Local development

Requires Node.js 24 or newer.

```sh
npm install
cp .env.example .env
# Set ADMIN_PASSWORD in .env
npm run dev
```

Store: `/`. Admin: `/admin`. No username is required.

## Coolify deployment

- Connect this repository and select the `main` branch.
- Build pack: **Dockerfile**, path `/Dockerfile`, port **3000**.
- Set the runtime variables below before deploying.
- Add a named persistent volume mounted at **/app/data**. The app runs as UID/GID 1000; the mounted directory must be writable by that user.
- Assign an HTTPS domain; production login uses Secure cookies.

| Variable | Value |
| --- | --- |
| `ADMIN_PASSWORD` | A strong private password. Use the existing local `.env` value to preserve admin access. |
| `DATA_DIR` | `/app/data` |
| `NODE_ENV` | `production` |
| `PORT` | `3000` |
| `HOSTNAME` | `0.0.0.0` |

Never commit `.env` or `data/`. SQLite stores products and orders in `DATA_DIR/store.sqlite`; uploaded product images are in `DATA_DIR/uploads/`. Back up that entire directory. Use one application replica with persistent disk.

The empty production database creates the starter catalog. Existing local orders and database records are intentionally excluded from Git. Product content, stock, delivery rules and garment size measurements should be reviewed before accepting real customer orders.

## Checks

```sh
npm test
npm run typecheck
npm run build
```

The checkout records cash-on-delivery orders. Online payment processing, courier integration, SMS and transactional email are not connected. The 3D preview allows image/text placement and PNG/GLB export; it is a visualization rather than a manufacturing pattern.

## Assets

The catalog uses supplied brand/product images and generated supporting assets. The premium hoodie GLB was supplied from the user's `premium-eco-hoodie` download. Keep any applicable attribution and licensing requirements with the original model and brand artwork.
