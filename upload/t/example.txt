#!/bin/bash
source lib/params.sh

bash lib/deb.sh "$version-$revision"
bash lib/rpm.sh "$version-$revision"
bash lib/bash.sh "$version-$revision"

mkdir out
cp build/deb/screen-sbs_*_all.deb out/
cp build/rpm/RPMS/noarch/screen-sbs-*.noarch.rpm out/
cp build/bash/screen-sbs_*.sh out/
