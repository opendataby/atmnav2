FONT_NAME=anfont
SVG_PATH=../svg
FONT_PATH=../css/font
FONT_BUILD_PATH=./font-builder

python ${FONT_BUILD_PATH}/fontbuild.py -c ./font.yaml -t ./font_template.sfd -i ${SVG_PATH}  -o ${FONT_PATH}/${FONT_NAME}.ttf
ttfautohint --latin-fallback --hinting-limit=200 --hinting-range-max=50 --symbol ${FONT_PATH}/${FONT_NAME}.ttf ${FONT_PATH}/${FONT_NAME}-hinted.ttf
mv ${FONT_PATH}/${FONT_NAME}-hinted.ttf ${FONT_PATH}/${FONT_NAME}.ttf
python ${FONT_BUILD_PATH}/fontconvert.py -i ${FONT_PATH}/${FONT_NAME}.ttf -o ${FONT_PATH}