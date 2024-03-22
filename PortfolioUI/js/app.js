(function (app) {
  'use strict';
  app.portfolioItems = [];
  app.selectedPortfolioItem = {};
  const basePortfolioApiUrl =
    'https://www.portfolioapi.somee.com/api/portfolio/';
  // const basePortfolioApiUrl = 'js/sitedata.json';

  app.homepage = function () {
    wireContactForm();
    setMyAge();
    setCopyrightDate();
  };

  app.portfolio = async function () {
    setCopyrightDate();
    await loadDataAsync();
    updateMenu();
    loadPortfolioItems();
  };

  app.workItem = async function () {
    setCopyrightDate();
    await loadDataAsync();
    updateMenu();
    loadSpecificItem();
    updateItemPage();
  };

  function setCopyrightDate() {
    const date = new Date();
    document.getElementById('copyrightYear').innerText = date.getFullYear();
  }

  function setMyAge() {
    const currentDate = new Date();
    const birthDate = new Date('1998-05-14');
    // at first currentDate in miMilliseconds
    const age = (currentDate - birthDate) / (1000 * 60 * 60 * 24 * 365);
    document.getElementById('myAge').innerText = Math.floor(age);
  }

  function wireContactForm() {
    const contactForm = document.getElementById('contact-form');
    contactForm.onsubmit = contactFormSubmit;
  }

  function contactFormSubmit(e) {
    e.preventDefault();

    const contactForm = document.getElementById('contact-form');

    const messageData = {
      senderName: contactForm.querySelector('#fullname').value,
      senderEmail: contactForm.querySelector('#email').value,
      SenderMessage: contactForm.querySelector('#message').value,
    };

    fetch(`${basePortfolioApiUrl}messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messageData),
    });

    //const myEmail = 'Stepan-Makarov98@yandex.ru';
    //const mailto = `mailto:${myEmail}?subject=Contact From ${fullname.value}&body=${message.value}`;
    //window.open(mailto);

    fullname.value = '';
    email.value = '';
    message.value = '';
    messageData.senderName = '';
    messageData.senderEmail = '';
    messageData.senderMessage = '';
  }

  async function loadDataAsync() {
    const cacheData = localStorage.getItem('site-data');

    if (cacheData !== null) {
      app.portfolioItems = JSON.parse(cacheData);
    } else {
      // const rawData = await fetch(`${basePortfolioApiUrl}`);
      const rawData = await fetch(`${basePortfolioApiUrl}projects`);
      const data = await rawData.json();
      app.portfolioItems = data;
      localStorage.setItem('site-data', JSON.stringify(data));
    }
  }

  function loadSpecificItem() {
    const params = new URLSearchParams(window.location.search);
    let item = Number.parseInt(params.get('item'));

    if (item > app.portfolioItems.length || item < 1) {
      item = 1;
    } else {
      app.selectedPortfolioItem = app.portfolioItems[item - 1];
      app.selectedPortfolioItem.id = item;
    }
  }

  function updateItemPage() {
    const header = document.getElementById('work-item-header');
    header.innerText = `0${app.selectedPortfolioItem.id}. ${app.selectedPortfolioItem.title}`;

    const images = document.getElementById('main-item-images');
    const originImages = images.querySelector('#item-images');
    const divImages = document.createElement('div');

    app.selectedPortfolioItem.bigImages.forEach((el) => {
      const img = document.createElement('img');
      const alts = app.selectedPortfolioItem.bigImagesAlt;
      img.src = el;
      img.alt = alts[0];

      if (alts.length > 0) {
        alts.splice(0, 1);
      } else {
        alts = [];
      }

      divImages.appendChild(img);
    });

    const projectText = document.querySelector('#project-text p');
    projectText.innerHTML = app.selectedPortfolioItem.projectText;

    const technologiesSection = document.getElementById('technologies-section');
    const technologiesText = technologiesSection.querySelector('p');
    const originTechnologiesList = technologiesSection.querySelector('ul');
    const newTechnologiesList = document.createElement('ul');

    technologiesText.innerText = app.selectedPortfolioItem.technologiesText;
    app.selectedPortfolioItem.technologiesList.forEach((el) => {
      const li = document.createElement('li');
      li.innerText = el;
      newTechnologiesList.appendChild(li);
    });

    originTechnologiesList.remove();
    technologiesSection.appendChild(newTechnologiesList);

    const challengesText = document.querySelector('#challenges-text p');
    challengesText.innerText = app.selectedPortfolioItem.challengesText;

    originImages.remove();
    divImages.id = 'item-images';
    images.appendChild(divImages);

    if (
      app.selectedPortfolioItem.linkToGitHub !== null &&
      app.selectedPortfolioItem.linkToGitHub !== undefined
    ) {
      const divLinkToGitHub = document.querySelector('.hiden-link-to-github');
      const linkToGitHub = divLinkToGitHub.querySelector('a');
      linkToGitHub.href = app.selectedPortfolioItem.linkToGitHub;
      linkToGitHub.innerText = 'Сcылка на GitHub';
      divLinkToGitHub.classList.remove('hiden-link-to-github');
      divLinkToGitHub.classList.add('link-to-github');
    }
  }

  function loadPortfolioItems() {
    const portfolioMain = document.getElementById('portfolio-main');
    const originHighlights = portfolioMain.querySelectorAll('.highlight');
    const newHighlights = [];

    for (let i = 0; i < app.portfolioItems.length; i++) {
      const el = app.portfolioItems[i];
      const highlight = document.createElement('div');
      highlight.classList.add('highlight');
      highlight.classList.add('black-background');
      if (i % 2 === 0) {
        highlight.classList.add('reverce');
      }
      if (i === app.portfolioItems.length - 1) {
        highlight.classList.add('last-item');
      }

      const divHeader = document.createElement('div');
      const h2 = document.createElement('h2');
      const a = document.createElement('a');

      const titleWords = el.title.split(' ');
      let title = `0${i + 1}. `;
      for (let j = 0; j < titleWords.length - 1; j++) {
        const word = titleWords[j];
        title += `${word}<br />`;
      }
      title += titleWords[titleWords.length - 1];

      h2.innerHTML = title;
      a.href = `workitem.html?item=${i + 1}`;
      a.innerText = 'Посмотреть подробнее';
      divHeader.appendChild(h2);
      divHeader.appendChild(a);

      const img = document.createElement('img');
      img.src = el.smallImage;
      img.alt = el.smallImageAlt;

      highlight.appendChild(divHeader);
      highlight.appendChild(img);
      newHighlights.push(highlight);
    }

    originHighlights.forEach((el) => el.remove());
    newHighlights.forEach((el) => {
      portfolioMain.appendChild(el);
    });
  }

  function updateMenu() {
    const navUl = document.querySelector('nav ul');
    const originNav = navUl.querySelectorAll('.nav-work-item');
    const newNav = document.createDocumentFragment();

    for (let i = 0; i < app.portfolioItems.length; i++) {
      const li = document.createElement('li');
      li.classList.add('nav-work-item');
      const a = document.createElement('a');
      a.href = `workitem.html?item=${i + 1}`;
      a.innerText = `Item #${i + 1}`;

      li.appendChild(a);
      newNav.appendChild(li);
    }
    originNav.forEach((el) => el.remove());
    navUl.append(newNav);
  }
})((window.app = window.app || {}));
