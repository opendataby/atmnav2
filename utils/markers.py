import os

ORIGINAL_IMAGES_IN_PATH = '../img/icons'

MARKER_IMAGES_OUT_PATH = '../img/markers'
MARKER_TEMPLATE_PATH = '../css/img/leaflet/marker-template.png'

script = '''
import os

images_in_path = '%(images_in_path)s'

markers_out_path = '%(markers_out_path)s'
marker_template_file = '%(marker_template_file)s'

image_extension = '.png'

image_filter = lambda file_name: file_name[-len(image_extension):] == image_extension


for root, dirs, files in os.walk(images_in_path):
    for file in filter(image_filter, files):
        input_path = os.path.join(root, file)
        output_path = os.path.join(markers_out_path, file)

        image = pdb.gimp_file_load(marker_template_file, 'template')
        layer = pdb.gimp_file_load_layer(image, input_path)
        image.add_layer(layer, 0)
        layer.scale(23, 23, 0)
        layer.set_offsets(7, 7)
        merged_layer = image.merge_visible_layers(0)
        pdb.file_png_save2(image, merged_layer, output_path, output_path, 0, 9, 0, 0, 0, 0, 0, 0, 0)


pdb.gimp_quit(0)
''' % {'images_in_path': os.path.abspath(ORIGINAL_IMAGES_IN_PATH),
       'markers_out_path': os.path.abspath(MARKER_IMAGES_OUT_PATH),
       'marker_template_file': os.path.abspath(MARKER_TEMPLATE_PATH),}

os.system("""gimp --no-interface --batch-interpreter python-fu-eval --batch "%s" """ % script)





