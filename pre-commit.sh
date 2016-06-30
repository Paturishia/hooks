#for year in {2002..2003}
#do
#   for tile in {1159..1160}
#        do wget --limit-rate=3m http://daymet.ornl.gov/thredds/fileServer/allcf/${year}/${tile}_${year}/vp.nc -O ${tile}_${year}_vp.nc
        # An example using curl instead of wget
    #do curl --limit-rate 3M -o ${tile}_${year}_vp.nc http://daymet.ornl.gov/thredds/fileServer/allcf/${year}/${tile}_${year}/vp.nc
#     done
#done

#git stash -q --keep-index
#./run_tests.sh
#RESULT=$?
#git stash pop -q
#[ $RESULT -ne 0 ] && exit 1
#exit 0
eslint "src/assets/javascripts/*"
RESULT=$?
[ $RESULT -ne 0 ] && exit 1
exit 0