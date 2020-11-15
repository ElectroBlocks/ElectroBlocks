
npm install
rm src/env.ts
cp env/env.staging.ts src/env.ts
rm -rf functions/package.json
rm -rf functions/package-lock.json 
cp -R package.json functions/package.json 
cp -R package-lock.json functions/package-lock.json 
npm --prefix functions install
rm -rf functions/__sapper__/build
mkdir -p functions/__sapper__/build