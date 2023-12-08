# ml-tornidor

## Local development

Because this project is hosted on Cloudflare pages to run a complete development environment use the command:

```bash
npx wrangler pages dev --binding VITE_AUTH0_DOMAIN="localhost-ml-tornidor.eu.auth0.com" API_URL="https://4ztuojowm4.execute-api.eu-west-1.amazonaws.com/localhost/lambda-ml-fastsam-api" VITE_AUTH0_AUDIENCE="http://localhost-ml-lambda/" API_DOMAIN=4ztuojowm4.execute-api.eu-west-1.amazonaws.com CORS_ALLOWED_DOMAIN=http://localhost:8788 VITE_SATELLITE_NAME="Esri.WorldImagery" -- deno task dev
```

In case of problem:

1. delete the node_modules folder
2. reinstall the npm packages with `pnpm install`
3. Run again the local development server, this time with the standard command

```bash
npx wrangler pages dev --binding VITE_AUTH0_DOMAIN="localhost-ml-tornidor.eu.auth0.com" API_URL="https://4ztuojowm4.execute-api.eu-west-1.amazonaws.com/localhost/lambda-ml-fastsam-api" VITE_AUTH0_AUDIENCE="http://localhost-ml-lambda/" API_DOMAIN=4ztuojowm4.execute-api.eu-west-1.amazonaws.com CORS_ALLOWED_DOMAIN=http://localhost:8788 VITE_SATELLITE_NAME="Esri.WorldImagery" -- pnpm pnpm_dev
```

When code is ready build with this command:

```bash
pnpm build
```

And check the distribution build is ok with this command:

```bash
npx wrangler pages dev --binding VITE_AUTH0_DOMAIN="localhost-ml-tornidor.eu.auth0.com" API_URL="https://4ztuojowm4.execute-api.eu-west-1.amazonaws.com/localhost/lambda-ml-fastsam-api" VITE_AUTH0_AUDIENCE="http://localhost-ml-lambda/" API_DOMAIN=4ztuojowm4.execute-api.eu-west-1.amazonaws.com CORS_ALLOWED_DOMAIN=http://localhost:8788 VITE_SATELLITE_NAME="Esri.WorldImagery" -- pnpm preview
```
