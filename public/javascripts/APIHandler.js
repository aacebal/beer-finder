class APIHandler {
  constructor (baseUrl) {
    this.BASE_URL = baseUrl;
  }

  getFullList () {
    $.ajax({
      url: this.BASE_URL + `?97f9b896722fcc35729ee079cf47b0b7&name=Hop Stimulator`,
      method: "GET",
      success: function (fullList){
        $('.character-info').remove();
          const newCharacter =
          `<div class="character-info">
            <div class="name">beer name: ${fullList.data}</div>
          </div>`;

          $('.characters-container').append(newCharacter);
      },
      error: function (err) {
      console.log(err);
      }
  });
}
}
