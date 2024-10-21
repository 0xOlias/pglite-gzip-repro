# pglite-gzip-repro

Reproduced on MacOS ARM64 Node 18, 20, 22 and Bun 1.1.31.

Error originating from: https://github.com/kravets-levko/tinytar/blob/master/lib/untar.js#L71

```
Error: File is corrupted.
    <stack trace>
    data: { offset: 257, field: 'ustar' }
```
