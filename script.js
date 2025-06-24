let quotes = [];

const quote_text = document.getElementById('newQuoteText');
const quote_category = document.getElementById('newQuoteCategory');

function createAddQuoteForm(){
  
  const text = quote_text.value;
  const category = quote_category.value;
  quotes.push({quote_text: text , quote_category: category});

  showRandomQuote ();
}

document.getElementById('newQuote').addEventListener(('click') , ()=>{
  let quoteForm = document.getElementById('quoteDisplay');
  let html = '';
  quotes.forEach((value)=>{
    html += `<div>${value.quote_text}</div><div>${value.quote_category}</div>`;
  });
  quoteForm.innerHTML = html;
});


function showRandomQuote (){
  let quoteForm = document.querySelector('.quoteForm');
  let randomQuoteIndex = Math.floor((Math.random()*quotes.length));

  quoteForm.innerHTML = `<div>${quotes[randomQuoteIndex].quote_text}</div>
      <div>${quotes[randomQuoteIndex].quote_category}</div>`;

}

