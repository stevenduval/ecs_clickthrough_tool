//set reusable variables
const findlinksBtn =  document.querySelector('.findlinks');
const updatelinksBtn =  document.querySelector('.updatelinks');
const saveBtn =  document.querySelector('.save');
const reloadBtn =  document.querySelector('.reload');
const input = document.querySelector('#input');
const billcode = document.querySelector('#billcode');
const linkTable = [];


// run when more than 1 character is typed in the box
const characterCount = () => {
    const inputLength = input.querySelector('textarea').value.length;
    const characterCountSpan = input.querySelectorAll('span')[1];
    characterCountSpan.innerText = (inputLength > 0) ? `Character Count : ${inputLength}` : '';
}

const showLinks = () => {
    // clear link area and count if button is clicked again
    document.querySelector('.link-count').innerHTML = '';
    document.querySelector('.link-area').innerHTML = '';
    //set reuseable variables
    const getBody = input.querySelector('textarea').value.match(/(<body[^]*)/g).toString();
    const getLinks = getBody.match(/(href\s*=\s*["])([^]*?)(?:["][^]*?)/g);
	let links = getLinks.map(link => (/""/g.test(link)) ? link.replace(/href\=/g,"").replace(/""/g,"blank href tag") : link.replace(/href\=/g,"").replace(/"/g,""));
    
    const clickthrough = links.map((link, index) => (!link.includes('google') && !link.includes('unsub')) ? `$clickthrough(${billcode.value.replace('-','_')}_Link_${index})$`: link);
    
    
    //links = links.filter(link => !link.includes('google') && !link.includes('unsub'));
    
    
    // place count of links into the DOM
    document.querySelector('.link-count').innerText = `${links.length} link(s) found in the HTML :`; 
    // create div elements for each link in the links array
    links.forEach(link => { 
        document.querySelector('.link-area')
            .insertAdjacentHTML('beforeend', 
                `<div class="link">
                    <div class="link-container">
                        <div class="currentLink">
                            <span>Current Link :</span><input type="text" readonly>
                        </div>
                        <div class="newLink">
                            <span>New Link :</span><input type="text">
                        </div>
                    </div>
                </div>`
            )
    });
    // insert link into input value *reason for this is so insertAdjacentHTML doesnt parse html entities as html characters*
    links.forEach((link,index) => {
        document.querySelectorAll('.link-area > .link > .link-container > .currentLink > input')[index].value = link;
        document.querySelectorAll('.link-area > .link > .link-container > .newLink > input')[index].value = clickthrough[index];
        linkTable.push(`${billcode.value.replace('-','_')}_Link_${index},${link}`);
    });
}

// run when save output is clicked
const saveOutput = () => { 
    // set reusable variables
    const getOldLinks = document.querySelectorAll('.currentLink > input');
    const getNewLinks = document.querySelectorAll('.newLink > input');
    const getNewLinksValues = [];
    const getHeader = input.querySelector('textarea').value.match(/<[^]*(?=<body)/g).toString();
    const getBody = input.querySelector('textarea').value.match(/(<body[^]*)/g).toString();
    const date = new Date().toLocaleString('en-ca').split(",")[0].replace(/-/g,"_");
    let i = 0;
    // for each new link, push it to an array
    getNewLinks.forEach( link => getNewLinksValues.push(link.value));
    // function to add href to new link values
    const returnFinalURLs = (url) => { 
        i++ 
        return 'href="' + getNewLinksValues[i-1] + '"' 
    };
    // replace urls with new url values
    const replacedLinks = getBody.replace(/(href\s*=\s*["])([^]*?)(?:["][^]*?)/g, returnFinalURLs)
    // set output area value
    const text = getHeader+replacedLinks.replace(/\n/g, "\r\n"); // To retain the Line breaks.
    const blob = new Blob([text], { type: "text/plain"});
    const anchor = document.createElement("a");
    anchor.download = `index_${billcode}_${date}.html`;
    anchor.href = window.URL.createObjectURL(blob);
    anchor.target ="_blank";
    anchor.style.display = "none"; // just to be safe!
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    
    const text2 = linkTable.join('\n');
    const blob2 = new Blob([text2], { type: "text/plain"});
    const anchor2 = document.createElement("a");
    anchor2.download = `$link_table_${billcode}_${date}.csv`;
    anchor2.href = window.URL.createObjectURL(blob2);
    anchor2.target ="_blank";
    anchor2.style.display = "none"; // just to be safe!
    document.body.appendChild(anchor2);
    anchor2.click();
    document.body.removeChild(anchor2);
}


// event listeners
findlinksBtn.addEventListener('click', showLinks);
saveBtn.addEventListener('click', saveOutput);
reloadBtn.addEventListener('click', () => location.reload(true));
input.querySelector('textarea').addEventListener('keyup', characterCount);
