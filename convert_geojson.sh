#!/bin/bash

#
# Converting files to GeoJSON
#
FOLDER=data/geo/shapefiles
cd $FOLDER
for f in *.shp
do
  echo " → Converting: $f"
  ogr2ogr -f GeoJSON -t_srs crs:84 $f.geojson $f
  mv $f.geojson ../geojson/
done
echo " SUCCESS: All files converted to GeoJSON."