const path = require('path');
const fs = require('fs');
const express = require('express');
const app = express();
const adaro = require('adaro');
const iterateHelper = require('dustmotes-iterate');
const markdownHelper = require('dustjs-helpers-markdown');
const marked = require('marked');

const production = process.env.NODE_ENV === 'production';
const staticPath = './static';
const templatePath = './templates';

let activities = JSON.parse(fs.readFileSync(path.join(staticPath, 'json', 'activities.json')));
const cv = JSON.parse(fs.readFileSync(path.join(staticPath, 'json', 'cv.json')));
const learnings = JSON.parse(fs.readFileSync(path.join(staticPath, 'json', 'learning.json')));
const projects = JSON.parse(fs.readFileSync(path.join(staticPath, 'json', 'projects.json')));
const inlineStyle = fs.readFileSync(path.join(staticPath, 'styles', 'inline.css'));

const analyses = [
  {
    title: "Défense des projets d'intégrations (3TI)",
    analyse: `
      La défense des projets d'intégrations des 3èmes est un événément dont j'ai participé lors de ma 2ème année à l'Ephec.
      Cette défense cloturait 4 mois de travail intense sur un projet libre visant à intégrer différents cours de l'école.
      Elle présentait la partie plus marketing du projet.

      Les objectifs pour moi étaient de premièrement trouver de l'inspiration pour le projet d'intégration dont j'ai naturellement participé cette année en 3ème mais égalemevvnt de voir comment se passait ces défenses.
      Le côté marketing est un côté où je suis moins à l'aise donc écouter les différentes questions du jury,... était un plus.

      J'ai trouvé beaucoup de projets intéressants tels que Intellifridge ou Smartlist mais malheureusement, cette année, les projets étaient centrés sur un seul thème donc le côté inspiration à moins servi.

      Au final, j'ai trouvé cela très intéressant et ce fut globalement une très bonne expérience.
    `
  },
  {
    title: "Semaine Internationale Makers",
    analyse: `
      La semaine makers avait pour but de réaliser un prototype destinée à une personne à mobilité réduite.

      Cette dernière est venue se présenter le premier jour, à expliquer son problèmes
      et ce qu'elle aurait besoin  pour l'aider dans la vie de tous les jours.

      Par groupe nous avons ensuite réfléchis à un prototype que nous pourrions réaliser.
      Pour nous aider, nous avons rencontrer différents "experts" qui soient connaissaient le milieu,
      soit venaient nous challenger et nous guider dans nos idées.

      Au final, nous avons réaliser "l'opencan" qui permet d'ouvrir une canette sans devoir utiliser ses doigts.
      Il suffit de placer la canette entre ses jambes, placer l'opencan sous la languette de la canette avec ses bras,
      passer sa main dans un fil formant une boucle et la soulever afin d'ouvrir la canette.

      Ce qui était intéressant c'était que nous avons fait le projet avec des étudiants en marketing.
      Nous n'avons pas l'habitude de travailler ensemble et cette semaine fut une bonne occasion.

      Ensuite, ce projet était réaliser pour une bonne cause.
    `
  },
  {
    title: "Formation C# - Base",
    analyse: `
    Les formations C# et ASP.net fûrent donnée par Technofutur à Gosselie.
    Elle m'a permis de découvrir le C#
    et d'apprendre un second language orienté objet et typé strict après le Java.

    Le formateur Michael Pierson nous a permis de vivre cette formation de manière détendue
    et dans la bonne humeur tout en apprenant beaucoup.
    J'ai pu remarquer qu'il est possible d'apprendre dans la rigolade et la bonne humeur
    sans être ultra sérieux tous le temps.
    A vrai dire, ce sont peut-être les formations où j'ai le plus à appris de toutes les formations
    faites à Technofutur.

    Egalement, ces formations m'ont permis de découvrir le milieu des formations
    qui est un milieu que l'on peut plus ou moins souvent retrouver en fonction de l'endroit où l'on travaille.
    `
  },
  {
    title: "Formation T-SQL et Administration SQL",
    analyse: `
      La formation en T-SQL et Administration de base de données
      avait pour but de nous faire aller plus loin dans le SQL par rapport à ce que nous avons appris à l'Ephec.
      Notamment en ce qui concerne l'administration.

      Toutefois, cette formation cette averée peu intéressante,
      j'ai remarqué que le SQL et les bases de données ne sont pas des domaines qui m'intéresses.
    `
  },
  {
    title: "Formation Java - Avancé",
    analyse: `
      La formation Java avancée tel qu'annoncée avait pour but de nous apprendre des notions
      plus avancées du language Java en comparaison avec ce que nous avons vu à l'Ephec.

      Pourtant, il s'est avéré que nous avons finalement fait du Web en Java via Java EE
      ce qui ne semblait pas prévu à la base.

      De nombreux problèmes ont fait que nous avons perdu 2 jours de formations avant de pouvoir réellement commencé à travailler.

      Cela m'a montré qu'il faut savoir être patient malgré les différents problèmes.
      Au final, je n'ai pas tellement aimé le Java EE car je trouve ça lent et verbeux.

      Cette formation m'a tout de même appris à faire du paire-programming car nous avons
      travaillé à 2 sur le projet en Java EE.
      Ensuite, j'ai également appris à travailler malgré tout même sur quelque chose qui ne m'intéresse vraiment pas.
    `
  },
  {
    title: "Formation C#, ASP.net - Avancé",
    analyse: `Voir analyse C# base`
  },
  {
    title: "Conférence Key Performance",
    analyse: `
      La conférence Key Performance présentait différents problèmes
      qui ralentissaient les sites-webs et les différents outils qui permettent de mesurer
      les performances d'un site web.

      J'ai trouvé cela intéressant car cela nous sensibilisait au fait
      qu'il est important qu'un site soit rapide afin d'offrir une bonne expérience utilisateur.

      Toutefois, je trouvais que cela manquait de véritable solutions pour améliorer
      les performances d'un site web.
    `
  },
  {
    title: "Conférence Assyst Europe",
    analyse: `
      Cette conférence avait pour but de de présenter le stage de l'entreprise Assyst Europe.

      Etant donné que j'avais déjà trouvé un stage, l'intérêt pouvait sembler moindre.
      Pourtant j'ai trouvé la présentation très intéressante.
      J'ai apprécié le fait qu'ils aient pris du temps pour expliquer l'ambiance de l'entreprise.
      Je pense que c'est important qu'un employé tout comme un stagiaire se sente bien dans son lieu de travail.
      Une bonne ambiance améliore également la qualité du travail.
    `
  },
  {
    title: "Hackages - React Native",
    analyse: `
      La hackjam était à la base présenté comme un hackaton sur react-native,
      une technologie permettant de réaliser des applications mobiles natives en javascript.\n

      Il s'est avéré que cela était plus une introduction à react-native qu'un véritable hackaton.
      Nous n'étions pas en équipe et nous devions compléter différentes parties
      d'une application d'exemple.

      J'étais donc un peu déçu même s'il est vrai qu'avec 2h, on avait pas beaucoup de temps
      pour réaliser un véritable hackaton.

      Toutefois, cela m'a permit de découvrir React-Native et j'ai personnellement
      trouver cela très sympa et très prometteur.
      Il se trouvera peut-être pourquoi pas dans un projet futur.

      De plus, cela m'a permis d'apprendre certaines choses à d'autres personnes moins
      ou pas habituées à l'univers React.
    `
  }
];

activities = activities.map(activity => {
  const analyse = analyses.find(analyse => analyse.title === activity.title)

  return {
    ...activity,
    // hacky stuff
    // to allow break line in markdown
    analyse: analyse.analyse.replace(/\n/g, '    \n')
  };
});

const options = {
  cache: production ? true : false,
  whitespace: production ? false : true,
  helpers: [
    require('../../helpers/add-hash'),
    require('../../filters/normalize-date'),
    iterateHelper,
    markdownHelper
  ]
};

const viewOptions = {
  title: 'Portfolio',
  styles: [path.join(staticPath, 'styles', 'ptf.css')],
  scripts: [path.join(staticPath, 'scripts', 'bundle.js')]
}

app.engine('dust', adaro.dust(options));
app.set('view engine', 'dust');
app.set('views', templatePath);

app.get('/', (req, res) => {
  res.status(200).render('sections/home',
  Object.assign(viewOptions, {
    inlineStyle,
    section: 'home'
  }));
});

app.get('/cv', (req, res) => {
  res.status(200).render('sections/cv',
  Object.assign(viewOptions, {
    cv,
    section: 'cv'
  }));
});

app.get('/activities', (req, res) => {
  res.status(200).render('sections/activities',
  Object.assign(viewOptions, {
    activities,
    section: 'activities'
  }));
});

app.get('/projects', (req, res) => {
  res.status(200).render('sections/projects',
  Object.assign(viewOptions, {
    projects,
    section: 'projects'
  }));
});

app.get('/learning', (req, res) => {
  res.status(200).render('sections/learning',
  Object.assign(viewOptions, {
    learnings,
    section: 'learnings'
  }));
});

module.exports = app;
