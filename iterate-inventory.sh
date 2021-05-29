#!/usr/bin/env bash

rm inventory.json inventory.jsonl

declare -a arr=(27013 36052)

for i in ${arr[@]}
do
  curl \
  --header "Content-Type: application/json" \
  --request POST \
  --data '{
      "brand": "TOY",
      "mode": "content",
      "group": true,
      "groupmode": "full",
      "relevancy": false,
      "pagesize": 50,
      "pagestart": 0,
      "filter": {
          "year": [2021], 
          "series": ["tacoma", "4runner", "tundra"], 
          "dealers": ['$i'],
          "andfields": ["accessory", "packages", "dealer"]
        }
    }' \
  https://www.toyota.com/config/services/inventory/search/getInventory \
  | jq -c \
    '.body.response.docs
      | .[] 
      | {
          dealer: '$i',
          vin: .vin,
          year: .year.code,
          vehicle: .grade.series_code,
          model: .grade.code,
          enginge: .engine.title,
          transmission: .transmission.title,
          drivetrain: .drive.title,
          cab: .cab.title,
          bed: .bed.title,
          color: .exteriorcolor.title,
          interior: .interiorcolor.title,
          base_msrp: .priceInfo.baseMSRP,
          total_msrp: .priceInfo.totalMSRP,
          availability_date: .availabilityDate,
          total_packages: .accessories | length,
          packages: .accessories | map(.title) | join(", "),
          created_at: now | strflocaltime("%Y-%m-%d %H:%M:%S")
        }' \
  >> inventory.jsonl
done

cat inventory.jsonl | jq -s '.' > inventory.json
