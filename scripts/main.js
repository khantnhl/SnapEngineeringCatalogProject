import { models } from './model.js';

// entry to app
// Initialize app
function initialize() {
    renderStories(models);
    setUpAdd();
    setUpDelete();
    setUpEdit();
    setUpSearch();
}

function setUpAdd() {

    const addButton = document.querySelector('.add-button');
    const writeButton = document.querySelector('.write-button');
    const addFormContainer = document.getElementById('add-form-container');

    writeButton.addEventListener('click', (event) => {
        addFormContainer.classList.remove('hidden');
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

        const newStory = {
            title,
            quote,
            story,
            country,
            genre,
            min_read,
            storylength,
            react,
            published_year
        };

        models.push(newStory);

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

            console.log("debug remove this", storyCard);
            
            if(index !== null){
                models.splice(index, 1);
                renderStories(models);
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

                console.log('story here for edit', editForm);

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

function renderStories(models) {
    const storiesContainer = document.querySelector('.user-stories');
    const template = document.querySelector('[data-story-template]');

    storiesContainer.querySelectorAll('.story-card-container').forEach((card) => card.remove());

    models.forEach((story, index) => {
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

        const card = copyNode.querySelector('.story-card-container');
        card.setAttribute('data-index', index);

        storiesContainer.appendChild(copyNode);
    });
}


document.addEventListener('DOMContentLoaded', initialize);
