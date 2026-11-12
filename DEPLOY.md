# Deploying

Every push to `main` deploys automatically through GitHub Actions
(`.github/workflows/deploy.yml`). It uploads only the files that changed to
`public_html` on the cPanel host over FTPS. You can also run it by hand from
GitHub → Actions → "Deploy to cPanel" → Run workflow.

## One-time setup

1. **cPanel → FTP Accounts → Add FTP Account**
   - Log in: e.g. `deploy`
   - Password: generate a strong one
   - Directory: `public_html` (exactly this, so the account can't reach anything outside the site)
   - Create. The full username will look like `deploy@logitechelevators.com`.

2. **GitHub → repo Settings → Secrets and variables → Actions → New repository secret**, add three:

   | Name | Value |
   |---|---|
   | `FTP_SERVER` | `logitechelevators.com` (or the "FTP Server" shown under cPanel → FTP Accounts → Configure FTP Client) |
   | `FTP_USERNAME` | `deploy@logitechelevators.com` |
   | `FTP_PASSWORD` | the password from step 1 |

3. Push to `main` (or Run workflow). The first run uploads every file in the repo
   once (~90 MB, includes `content/` and `media/` videos); later runs upload only changes.

## Notes

- Files on the server that are not in this repo (`logitech_crm`, `application`,
  `system`, `cgi-bin`, `index.php`, etc.) are never modified or deleted.
- Deleting a file from the repo deletes it from the server on the next deploy
  (only if it was uploaded by this workflow).
- If FTPS fails with a TLS/certificate error, change `protocol: ftps` to `ftp`
  in the workflow (less secure; the password is then sent unencrypted).
