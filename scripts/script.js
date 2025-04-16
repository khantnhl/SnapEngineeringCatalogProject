import { getModel, updateModel } from './model.js';
import { sortFunction } from './sort.js';

let models = getModel(); 

// Initialize app
function initialize() {

    updateAndRender(models);

    setUpAdd();
    setUpDelete();
    setUpEdit();
    setUpSearch();
    setUpFilter();

    //for Checked Boxes Filter 
    setupCountryCheckboxes();
    setupGenreCheckboxes();
    setupSortDropdown();
    setupResetButton();
}

function setUpAdd() {

    const addButton = document.querySelector('.add-button');
    const writeButton = document.querySelector('.write-button');
    const addFormContainer = document.getElementById('add-form-container');

    writeButton.addEventListener('click', (event) => {
        addFormContainer.classList.toggle('hidden');
    });

    document.addEventListener('click', (event) => {
        if(!addFormContainer.contains(event.target) && (event.target !== writeButton)){
            addFormContainer.classList.add('hidden');
        }
    });

    addButton.addEventListener('click', (event) => {
        event.preventDefault();

        const title = document.getElementById('form-title').value;
        const quote = document.getElementById('form-quote').value;
        const story = document.getElementById('form-story').value;
        const country = document.getElementById('form-country').value;
        const genre = document.getElementById('form-genre').value;
        const min_read = document.getElementById('form-min_read').value;
        const storylength = document.getElementById('form-storylength').value;
        const react = document.getElementById('form-react').value;
        const published_year = document.getElementById('form-published_year').value;
        const imgUrl = 'assets/fallback.jpg';

        //lightweight error-handling
        if(!title || !quote || !story || !country || !genre || !min_read || !storylength || !react || !published_year) {
            alert("Please fill in all Required Fields!");
            return;
        }

        const newStory = {
            title,
            quote,
            story,
            country,
            genre,
            min_read,
            storylength,
            react,
            published_year,
            imgUrl
        };

        models.push(newStory);
        updateModel(models);

        document.getElementById('add-form').reset(); // Reset 
        renderStories(models);
    })
}

function setUpDelete(){
    //delete a story
    document.addEventListener('click', (event) => {
        if(event.target.matches('[data-delete]')) {
            const storyCard = event.target.closest('.story-card-container')
            const index = storyCard.getAttribute('data-index');

            // console.log("debug remove this", storyCard);
            
            if(index !== null){
                models.splice(index, 1);
                updateAndRender(models);
            }
        }
    });

}

function setUpEdit() {
        document.addEventListener('click', (event) => {
            if(event.target.matches('[data-edit]')){
                const storyCard = event.target.closest('.story-card-container');
                const index = storyCard.getAttribute('data-index');
                const editForm = storyCard.querySelector('.edit-story-form');
                const editFormContainer = storyCard.querySelector('#edit-form-container');

                //current pre-filled inputs
                const story = models.at(index);

                // console.log('story here for edit', editForm);

                editForm.title.value = story.title;
                editForm.quote.value = story.quote;
                editForm.story.value = story.story;
                editForm.country.value = story.country;
                editForm.genre.value = story.genre;
                editForm.min_read.value = story.min_read;
                editForm.storylength.value = story.storylength;
                editForm.react.value = story.react;
                editForm.published_year.value = story.published_year;

                editFormContainer.classList.remove('hidden');
            } 

            if(event.target.matches('.edit-story-form button[type="submit"]')){
                event.preventDefault();

                const form = event.target.closest('.edit-story-form');
                const storyCard = event.target.closest('.story-card-container');
                const index = storyCard.getAttribute('data-index');

                models[index] =  {
                    title: form.title.value,
                    quote : form.quote.value,
                    story : form.story.value,
                    country : form.country.value,
                    genre : form.genre.value,
                    min_read : form.min_read.value,
                    storylength : form.storylength.value,
                    react : form.react.value,
                    published_year : form.published_year.value,
                };

                storyCard.querySelector('#edit-form-container').classList.add('hidden');

                renderStories(models);
            }
        });
}

function setUpSearch() {
    const searchInput = document.querySelector('.search-input');

    searchInput.addEventListener('input', (event) => {
        const keyword = event.target.value.toLowerCase();
    
        if(keyword === ''){
            renderStories(models);
            return;
        }

        const filteredStories = models.filter((story) => 
            story.title.toLocaleLowerCase().includes(keyword) || story.country.toLocaleLowerCase().includes(keyword)
        );

        renderStories(filteredStories);
    });

}

function setUpFilter() {
    const filterButton = document.querySelector('.filter-button');
    const filterCardContainer = document.querySelector('.filter-card-container');

    filterButton.addEventListener('click', () => {
        filterCardContainer.classList.toggle('hidden');
    });

    document.addEventListener('click', (event) => {
        if (!filterButton.contains(event.target) && !filterCardContainer.contains(event.target)) {
            filterCardContainer.classList.add('hidden');
        }
    });


    document.querySelector('.reset-button').addEventListener('click', resetFilters);
}

function resetFilters() {

    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    document.getElementById('sort').value = '';
    
    renderStories(models);
    
}

function getCheckedCountryFilters(checkedFiltersStory) {
    return Array.from(document.querySelectorAll(`.${checkedFiltersStory}:checked`)).map(checked => checked.dataset.country);
}

function getCheckedGenreFilters(checkedFiltersGenre) {

    const test = document.querySelectorAll(`.${checkedFiltersGenre}:checked`);
    
    // console.log('test check', test)

    return Array.from(document.querySelectorAll(`.${checkedFiltersGenre}:checked`)).map(checked => checked.dataset.genre);
}


  
function setupCountryCheckboxes() {
    document.querySelectorAll('.country-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            
            const checkedBoxes = getCheckedCountryFilters('country-checkbox');
            
            // console.log("checked boxes:", checkedBoxes);
            
            rendertheseSelectedStories(checkedBoxes);
        });
    });
}

function setupGenreCheckboxes() {
    document.querySelectorAll('.genre-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            
            const checkedBoxes = getCheckedGenreFilters('genre-checkbox');
            
            // console.log("checked boxes genre:", checkedBoxes);
            
            rendertheseSelectedGenre(checkedBoxes);
        });
    });
}
  
function rendertheseSelectedStories(checkedboxesArray) {
    const filteredStories = models.filter(story => checkedboxesArray.includes(story.country));
    // console.log("country based render ", filteredStories);

    renderStories(filteredStories);
}

function rendertheseSelectedGenre(checkedboxesArray) {
    const filteredStories = models.filter(story => 
        checkedboxesArray.some(genre => story.genre.includes(genre))
    );

    // console.log("render ", filteredStories);

    renderStories(filteredStories);
}


// Set up sort dropdown
function setupSortDropdown() {

    const sortDropdown = document.getElementById('sort');
    sortDropdown.addEventListener('change', (event) => {

        // console.log('inside sort dropdown');
        
        const sorted = sortFunction(models, event.target.value);
        renderStories(sorted);
    });
}

// Reset button functionality
function setupResetButton() {
    document.querySelector('.reset-button').addEventListener('click', () => {
        document.getElementById('sort').value = '';
        renderStories(models); // Reset to original order
    });
}

function renderStories(models) {

    const storiesContainer = document.querySelector('.user-stories');
    const template = document.querySelector('[data-story-template]');

    storiesContainer.querySelectorAll('.story-card-container').forEach((card) => card.remove());

    models.forEach((story, index) => {

        // console.log(`Rendering story ${index}:`, story);

        const copyNode = template.content.cloneNode(true);

        copyNode.querySelector('[data-title]').textContent = story.title;
        copyNode.querySelector('[data-quote]').textContent = story.quote;
        copyNode.querySelector('[data-story]').textContent = story.story;
        copyNode.querySelector('[data-country]').textContent = story.country;
        copyNode.querySelector('[data-genre]').textContent = story.genre;
        copyNode.querySelector('[data-min_read]').textContent = story.min_read;
        copyNode.querySelector('[data-storylength]').textContent = story.storylength;
        copyNode.querySelector('[data-react]').textContent = story.react;
        copyNode.querySelector('[data-published_year]').textContent = story.published_year;

        // console.log('imgurl: ', story.imgUrl);
        
        copyNode.querySelector('[data-img]').innerHTML =
        `<img src="${story.imgUrl}" alt="${story.title}" style="width:100%; height:100%; object-fit:cover; border-radius:8px;" />`;
        
        const card = copyNode.querySelector('.story-card-container');
        card.setAttribute('data-index', index);

        storiesContainer.appendChild(copyNode);
    });
}

function updateAndRender(newData) {
    updateModel(newData); 
    models = getModel(); 
    renderStories(models); 
  }

document.addEventListener('DOMContentLoaded', initialize);
