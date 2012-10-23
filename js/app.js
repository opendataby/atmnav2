// set default settings at the first start
if (!localStorage.getItem('objects')) {
    app.utils.log('setting default settings for objects');
    app.utils.saveData('objects', app.settings.defaultObjects);
}

if (!localStorage.getItem('filters')) {
    app.utils.log('setting default settings for filters');
    app.utils.saveData('filters', app.settings.defaultFilters);
}