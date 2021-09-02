#!/bin/bash
#The script will output to stdout the statistics of filling all the tables of the data schema for the specified period

#specifying the date range
date_start=$(date '+%Y%m%d'  -d "2021-1-1") || exit -1
date_end=$(date '+%Y%m%d'  -d "2021-8-25") || exit -1

mapfile -t table < <(hive -S -e 'use data; show tables;' 2>/dev/null |grep -v "meta" |uniq)

#creating one large query for all tables for fast execution
hql=""
for i in ${table[@]}; do
    hql+=" select '${i}' as table_name, from_unixtime( cast(substr(started,1,10) as INT) ,'yyyyMMddHH')||'0000' as tr_to_hour, count(1) as cnt_ from ${i} where pdate>='${date_start}' and pdate<='${date_end}' group by from_unixtime( cast(substr(started,1,10) as INT) ,'yyyyMMddHH');"
done;

hive -S -e "use data;${hql}" 2>./stat_debug.txt
