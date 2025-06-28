let quotes = JSON.parse(localStorage.getItem('quotes')) || [];

const quote_text = document.getElementById('newQuoteText');
const quote_category = document.getElementById('newQuoteCategory');
let serverQuote = localStorage.getItem('serverQuote') || [];

populateCategories(); //--> categ charged



function createAddQuoteForm(){
  
  const text = quote_text.value;
  const category = quote_category.value;
  quotes.push({quote_text: text , quote_category: category});

  let storedquotes = JSON.stringify(quotes);
  localStorage.setItem('quotes',storedquotes);

  addQuote();
  quote_text.value = '';
  quote_category.value = '';
}  

document.getElementById('newQuote').addEventListener(('click') , ()=>{
  let quoteForm = document.getElementById('quoteDisplay');
  let html = '';
  quotes.forEach((value)=>{
    html += `<div>${value.quote_text} => ${value.quote_category}</div>`;
  });
  quoteForm.innerHTML = html;
});

function downloadQuoteData(){
  let storedquotes = JSON.stringify(quotes);

  let blob = new Blob([storedquotes], {type : "application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.download = 'quotes.json';
  a.href = url;
  a.click();

  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

  function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
      const importedQuotes = JSON.parse(event.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
  }


function showRandomQuote (){

  let quoteForm = document.querySelector('.quoteForm');
  quoteForm.innerHTML = ''; // Vide le contenu précédent

  let randomQuoteIndex = Math.floor(Math.random() * quotes.length);
  let quote = quotes[randomQuoteIndex];

  const quoteDiv = document.createElement('div');
  quoteDiv.textContent = quote.quote_text;

  const categoryDiv = document.createElement('div');
  categoryDiv.textContent = quote.quote_category;

  quoteForm.appendChild(quoteDiv);
  quoteForm.appendChild(categoryDiv);
  /*let quoteForm = document.querySelector('.quoteForm');
  let randomQuoteIndex = Math.floor((Math.random()*quotes.length));

  quoteForm.innerHTML = `<div>${quotes[randomQuoteIndex].quote_text}</div>
      <div>${quotes[randomQuoteIndex].quote_category}</div>`;*/

}



function populateCategories(){

  const disquote = document.getElementById('categoryFilter');
  disquote.innerHTML = '';
  let catList = new Set();
  
  quotes.forEach((quote) =>{
    catList.add(quote.quote_category);
  });

  catList.forEach((category)=>{
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category; 
    disquote.appendChild(option);
  });
  const selectedCategory = document.getElementById('categoryFilter');
  const display = document.getElementById('quoteDisplay');
  const chargedquote = localStorage.getItem('filteredQuotesJSON') || '[]';
  const chargeCat = localStorage.getItem('CatID') || '[]';
  const filteredQuotes = JSON.parse(chargedquote);
  console.log(filteredQuotes);
  let html = chargeCat;
  filteredQuotes.forEach((quote) => {
    html += `<div>=> ${quote.text}</div>`; 
  });
  //console.log(html);
  display.innerHTML = html;
}

function filterQuotes(){
      let quoteForm = document.getElementById('quoteDisplay');
      const selectedCategory = document.getElementById('categoryFilter');
      let html = `<div>${selectedCategory.value}</div>`;

      let filteredQuotes = [];


     /* quotes.forEach((value)=>{
        if(value.quote_category === selectedCategory.value){

          filteredQuotes.push({text : value.quote_text, category : value.quote_category});
          html += `<div>=> ${value.quote_text}</div>`;          
        }

      });*/
       // console.log('quotes' + filteredQuotes);
      let toUseMap = quotes.filter((q) => q.quote_category === selectedCategory.value)
     .map((q) => {
    html += `<div>=> ${q.quote_text}</div>`;
    return { text: q.quote_text, category: q.quote_category };
    });
      const strg_filteredQuotes = JSON.stringify(toUseMap);
      localStorage.setItem('filteredQuotesJSON', strg_filteredQuotes);
      localStorage.setItem('CatID', selectedCategory.value);
      
      quoteForm.innerHTML = html;

}

function addQuote(){
  
  catList = new Set();

  quotes.forEach((val) =>{
    catList.add(val.quote_category);
  });
  
  const dropBox = document.getElementById('categoryFilter');

  dropBox.innerHTML = '';



  catList.forEach((val)=>{
    const option = document.createElement('option');
    option.value = val;
    option.textContent = val;
    dropBox.appendChild(option);
  });
  
}

/*setInterval(() => {
  fetch('https://jsonplaceholder.typicode.com/posts')
  .then(fetchQuotesFromServer => fetchQuotesFromServer.json())
  .then(posts => {
    //serverQuote = [];
    //console.log(posts);
    if(serverQuote.length !== posts.length){
      const userChoice = confirm('New data available, do you want to update ?');
      if(userChoice){
        serverQuote = [];
        posts.forEach((quote)=>{
            serverQuote.push({cat : quote.title , text : quote.body})
        });
        console.log(serverQuote);
        localStorage.setItem('serverQuote', JSON.stringify(serverQuote));
        alert("Quotes updated from server!");
      }
     }

    
  }).catch(error => {
    console.error('Server error',error);
  }) ;
}, 3000);*/
setInterval(fetchServerQuotes, 3000);

async function fetchServerQuotes() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const posts = await response.json();

    if (serverQuote.length !== posts.length) {
      const userChoice = confirm('New data available, do you want to update ?');
      if (userChoice) {
        serverQuote = posts.map(quote => ({
          cat: quote.title,
          text: quote.body
        }));

        console.log(serverQuote);
        localStorage.setItem('serverQuote', JSON.stringify(serverQuote));
        alert("Quotes updated from server!");
      }
    }
  } catch (error) {
    console.error('Server error', error);
  }
}