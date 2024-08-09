import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import Base64 from 'base64-js';
import MarkdownIt from 'markdown-it';
import './style.css';

// 🔥🔥 FILL THIS OUT FIRST! 🔥🔥
// Get your Gemini API key by:
// - Selecting "Add Gemini API" in the "Project IDX" panel in the sidebar
// - Or by visiting https://g.co/ai/idxGetGeminiKey
let API_KEY = 'key';



let rootElement = document.querySelector("#root")
const tableBodyElement = document.querySelector("#table-body");
const serachPortal = async(imageUrl,promptInput)=>{
  try {
    // Load the image as a base64 string
   // let imageUrl = form.elements.namedItem('chosen-image').value;
    let imageBase64 = await fetch(imageUrl)
      .then(r => r.arrayBuffer())
      .then(a => Base64.fromByteArray(new Uint8Array(a)));

    // Assemble the prompt by combining the text with the chosen image
    let contents = [
      {
        role: 'user',
        parts: [
          { inline_data: { mime_type: 'image/jpeg', data: imageBase64, } },
          { text: promptInput }
        ]
      }
    ];

    // Call the multimodal model, and get a stream of results
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash", // or gemini-1.5-pro
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
      ],
    });

    const result = await model.generateContentStream({ contents });

    // Read from the stream and interpret the output as markdown
    let buffer = [];
    let md = new MarkdownIt();
    for await (let response of result.stream) {
      buffer.push(response.text());
     
    }
   console.log( md.render(buffer.join('')));
   return  md.render(buffer.join(''));
  } catch (e) {
    return "{}";
    //output.innerHTML += '<hr>' + e;
  }
}
export function searchColorsForPortal(){
  rootElement.innerHTML = `
  <h1>Search colors for portal</h1>
  <lable>select the portal image</label>
  <input type="file" id="imageInput" accept="image/*">
  <button id="summarizeButton">Search</button>
  <div id="summary"></div>
  `
  const imageInput = document.getElementById('imageInput');
const summarizeButton = document.getElementById('summarizeButton');
const summary = document.getElementById('summary');

summarizeButton.addEventListener('click', async () => {
  const selectedFile = imageInput.files[0];
  if (!selectedFile) {
    summary.textContent = 'Please select an image to summarize.';
    return;
  }

  // Simulate image upload (replace with actual upload logic)
  const imageUrl = URL.createObjectURL(selectedFile);
  const prompt = `Please analyze the provided image of a ServiceNow portal and identify the various colors used. Return the colors in the following JSON format:
  {
    "brand-primary": "",
    "body-bg": "",
    "brand-success": "",
    "state-success-text": "",
    "sp-navbar-divider-color": "",
    "text-color": "",
    "navbar-inverse-link-hover-color": "",
    "navbar-inverse-bg": "",
    "brand-warning": "",
    "brand-danger": "",
    "sp-tagline-color": "",
    "navbar-inverse-link-active-color": "",
    "navbar-inverse-link-color": "",
    "brand-info": "",
    "link-color": "",
    "sp-logo-margin-x": "",
    "text-muted": "",
    "link-hover-decoration": "",
    "brand-primary-dark": "",
    "brand-primary-darker": "",
    "brand-primary-light": "",
    "brand-primary-lighter": "",
    "brand-primary-lightest": "",
    "dropdown-link-disabled-color": "",
    "link-hover-color": "",
    "navbar-inverse-link-active-bg": "",
    "navbar-inverse-link-hover-bg": "",
    "panel-primary-border": "",
    "panel-primary-heading-bg": "",
    "panel-primary-text": "",
    "primary": "",
    "input-border-focus": "",
    "quicklinks-background": "",
    "btn-success-bg": "",
    "btn-default-color": "",
    "btn-primary-color": "",
    "btn-primary-bg": "",
    "btn-primary-border": "",
    "btn-success-border": "",
    "btn-success-color": "",
    "btn-disabled-opacity": "",
    "component-active-color": "",
    "component-active-bg": "",
    "no-issue-color": "",
    "planned-maintenance-color": "",
    "service-degredation-color": "",
    "service-outage-color": "",
    "no-issue-border-color": "",
    "planned-maintenance-border-color": "",
    "service-degredation-border-color": "",
    "service-outage-border-color": "",
    "no-issues-text": "",
    "planned-maintenance-text": "",
    "service-degredation-text": "",
    "service-outage-text": "",
    "login-btn-bg": "",
    "login-btn-border": "",
    "qa-tag-color": "",
    "qa-tag-bg": "",
    "qa-tag-border": "",
    "qa-tag-hover-color": "",
    "qa-tag-hover-bg": "",
    "qa-thread-tag-color": "",
    "qa-thread-tag-bg": "",
    "qa-thread-tag-hover-color": "",
    "qa-thread-tag-hover-bg": "",
    "qa-panel-link-color": "",
    "select2-container-active": "",
    "not-webkit-outline-color": "",
    "webkit-outline-color": "",
    "label-success-bg": "",
    "label-info-bg": "",
    "label-warning-bg": "",
    "label-danger-bg": "",
    "label-primary-bg": "",
    "data-table-selected": "",
    "button-selected-color": "",
    "dropdown-link-active-bg": "",
    "dropdown-link-active-color": "",
    "widget-editor-fa-bg": "",
    "input-border-tab-focus": "",
    "fav-star-color": "",
    "fav-star-color-off": "",
    "fav-star-outline-color": "",
    "fav-star-outline": "",
    "sc-field-error-color": "",
    "qa-star-color-on": "",
    "qa-star-color-off": "",
    "list-group-link-color": "",
    "list-group-hover-bg": "",
    "accessible-placeholder-gray": ""
}
if you can not identify the given key color then make the value as empty.
  Ensure the response is a plain string and does not include any additional data or HTML.
  `;
  // Replace with actual Gemini API call (for demonstration purposes)
  tableBodyElement.innerHTML = "Loading....";
  const placeholderSummary1 = await serachPortal(imageUrl,prompt)
  tableBodyElement.innerHTML = "";
  let placeholderSummary = placeholderSummary1.replaceAll("&quot;","\"");
  placeholderSummary = placeholderSummary.replaceAll("<p>","");
  placeholderSummary = placeholderSummary.replaceAll("</p>","");
  placeholderSummary = placeholderSummary.replaceAll('<code class="language-json">',"");
  placeholderSummary = placeholderSummary.replaceAll('</code>',"");
placeholderSummary =  placeholderSummary.replaceAll("<pre>","");
placeholderSummary =  placeholderSummary.replaceAll("</pre>","");
const oldValues = {
  "brand-primary": "#1F8476",
  "body-bg": "#ffffff",
  "brand-success": "#48C891",
  "state-success-text": "#1a424b",
  "sp-navbar-divider-color": "#5A7F71",
  "text-color": "#2e2e2e",
  "navbar-inverse-link-hover-color": "#303636",
  "navbar-inverse-bg": "#293e40",
  "brand-warning": "#DFD139",
  "brand-danger": "#C83C36",
  "sp-tagline-color": "#ffffff",
  "navbar-inverse-link-active-color": "#ffffff",
  "navbar-inverse-link-color": "#A7B0B2",
  "brand-info": "#6ABECF",
  "link-color": "#1F8476",
  "sp-logo-margin-x": "15px",
  "text-muted": "#666666",
  "link-hover-decoration": "underline",
  "brand-primary-dark": "#1F8476",
  "brand-primary-darker": "#165C53",
  "brand-primary-light": "#5FBAA4",
  "brand-primary-lighter": "#B8E0D7",
  "brand-primary-lightest": "#EEF8F8",
  "dropdown-link-disabled-color": "#666666",
  "link-hover-color": "#285757",
  "navbar-inverse-link-active-bg": "#213234",
  "navbar-inverse-link-hover-bg": "#22B9A5",
  "panel-primary-border": "#1F8476",
  "panel-primary-heading-bg": "#1F8476",
  "panel-primary-text": "#ffffff",
  "primary": "#1F8476",
  "input-border-focus": "#1f8476",
  "quicklinks-background": "#EDF7F5",
  "btn-success-bg": "#48C891",
  "btn-default-color": "#2e2e2e",
  "btn-primary-color": "#ffffff",
  "btn-primary-bg": "#1F8476",
  "btn-primary-border": "#1b6e63",
  "btn-success-border": "#3ea37f",
  "btn-success-color": "#1a424b",
  "btn-disabled-opacity": 0.25,
  "component-active-color": "#4a4a4a",
  "component-active-bg": "#f5f5f5",
  "no-issue-color": "#9ae7d0",
  "planned-maintenance-color": "#a3dce7",
  "service-degredation-color": "#f6e7b5",
  "service-outage-color": "#ec9393",
  "no-issue-border-color": "#48C891",
  "planned-maintenance-border-color": "#6ABECF",
  "service-degredation-border-color": "#DFD139",
  "service-outage-border-color": "#C83C36",
  "no-issues-text": "#1a424b",
  "planned-maintenance-text": "#274b55",
  "service-degredation-text": "#274b55",
  "service-outage-text": "#d67a75",
  "login-btn-bg": "#1F8476",
  "login-btn-border": "#1b6e63",
  "qa-tag-color": "#274b55",
  "qa-tag-bg": "#99c6d2",
  "qa-tag-border": "#99c6d2",
  "qa-tag-hover-color": "#1e3a45",
  "qa-tag-hover-bg": "#88aab2",
  "qa-thread-tag-color": "#274b55",
  "qa-thread-tag-bg": "#99c6d2",
  "qa-thread-tag-hover-color": "#1e3a45",
  "qa-thread-tag-hover-bg": "#88aab2",
  "qa-panel-link-color": "#1F8476",
  "select2-container-active": "#1f8476",
  "not-webkit-outline-color": "#1f8476",
  "webkit-outline-color": "#1f8476",
  "label-success-bg": "#7fd2a1",
  "label-info-bg": "#99c6d2",
  "label-warning-bg": "#f0d45d",
  "label-danger-bg": "#d67a75",
  "label-primary-bg": "#C83C36",
  "data-table-selected": "#1F8476",
  "button-selected-color": "#1F8476",
  "dropdown-link-active-bg": "#1F8476",
  "dropdown-link-active-color": "#ffffff",
  "widget-editor-fa-bg": "#1F8476",
  "input-border-tab-focus": "#1f8476",
  "fav-star-color": "#b1a72d",
  "fav-star-color-off": "#ffffff",
  "fav-star-outline-color": "#6b611f",
  "fav-star-outline": "-1px 0 #6b611f, 0 1px #6b611f, 1px 0 #6b611f, 0 -1px #6b611f",
  "sc-field-error-color": "#1a424b",
  "qa-star-color-on": "#DFD139",
  "qa-star-color-off": "#ffffff",
  "list-group-link-color": "#1F8476",
  "list-group-hover-bg": "#abdad5",
  "accessible-placeholder-gray": "#565656"
}

const summeryJson = JSON.parse(placeholderSummary);
console.log("kiran ",summeryJson)
const keys = Object.keys(summeryJson);
for(let key in keys){
  const hh = document.createElement("tr");
  const td1 = document.createElement("td");
  const td2 = document.createElement("td");
  const td3 = document.createElement("td");
  td1.textContent = keys[key];
  td2.textContent = summeryJson[keys[key]];
  td2.style.backgroundColor = summeryJson[keys[key]];
  td3.textContent = oldValues[keys[key]];
  td3.style.backgroundColor = oldValues[keys[key]];
  tableBodyElement.appendChild(hh);
  hh.appendChild(td1);
  hh.appendChild(td2);
  hh.appendChild(td3);
  tableBodyElement.appendChild(hh);
}
 // summary.textContent = placeholderSummary;
}); 
}


// You can delete this once you've filled out an API key
searchColorsForPortal();