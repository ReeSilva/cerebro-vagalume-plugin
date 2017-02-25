'use strict';
const Vagalume = require('vagalume');
const vagalumeApi = new Vagalume();
const co = require('co');

const vagalumeApiKey = '387980fe1f207402d2b0cd1bba3267cf';

const plugin = co.wrap(function* plugin ({term, display, actions, hide}) {
  // It is your main plugin function
  // do something and call display() with your results
  const match = term.match(/^vagalume\s(.+)/);
  if (match) {
    let musicas = '';
    
    display({
      id: 'vagalume',
      title: `Procurando por ${match[1]} no Vagalume...`
    })
    
    try{
      musicas = yield vagalumeApi.getByTrecho(match[1], 5);
    }
    catch (e) {
      throw e;
    }
    
    hide('vagalume');
    
    musicas.response.docs.map(co.wrap(function* (doc) {
      const response = yield fetch(`https://api.vagalume.com.br/search.php?musid=${doc.id}&apikey=${vagalumeApiKey}`);
      const finalResponse = yield response.json();
      
      display({
        title: `${doc.band} - ${doc.title}`,
        subtitle: doc.url,
        getPreview: () => (
          `<div>
            <h2>${doc.band} - ${doc.title}</h2>
            <div>${finalResponse.mus[0].text.substring(0, 250)}</div>
          </div>`
        ),
        onSelect: (event) => actions.open(`https://www.vagalume.com.br${doc.url}`)
      });
    }));
  };
});

module.exports = {
  name: 'Procure músicas no Vagalume',
  keyword: 'vagalume',
  fn: plugin
}
