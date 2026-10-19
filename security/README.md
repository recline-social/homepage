# Recline public release key

Before publishing a public desktop release, copy the **actual exported** public key
`recline-public-key.asc` to this directory. Do not create a placeholder `.asc` file.

The released public key must have fingerprint:

    D7CE B113 4DCE 0311 F248 B631 8BA0 74B4 B137 5AD6

On Windows, export and inspect it with:

```powershell
gpg --armor --output "$HOME\Downloads\recline-public-key.asc" --export D7CEB1134DCE0311F248B6318BA074B4B1375AD6
gpg --show-keys --fingerprint "$HOME\Downloads\recline-public-key.asc"
```

Keep the private key, secret subkeys, revocation certificate, passphrase and signing
backups **outside** this Git repository and all published web directories.
