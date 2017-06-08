const charactersAPI = new APIHandler(`http://api.brewerydb.com/v2/beers/`);

$(document).ready( () => {
  $('#fetch-all').on('click', (e) => {
    charactersAPI.getFullList();
  });
});
