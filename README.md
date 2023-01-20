![heading](links/heading.png)

## About

"Parasite" is an interactive website built on [p5.js](https://p5js.org) that reveals the proliferation of connections between users, placing a limit on these connections that are conditioned by factors that don't permit them to be infinite and automatic.
"Parasite was developed as part of the [Creative Coding](https://drawwithcode.github.io/) course at the Politecnico di Milano.
<br>Faculty: Michele Mauri, Tommaso Elli, Andrea Benedetti

## Table of Contents

1. [Project idea](#Project-idea)<br>
   a. [Concept](#concept)<br>
   b. [Context of use](#context-of-use)<br>
2. [Structure](#structure)<br>
   a. [Homepage](#homepage)<br>
   b. [Mobile Interface](#mobile-interface)<br>
   c. [Microverse](#microverse)<br>
3. [The Code](#the-code)<br>
   a. [Design challenges](#design-challenges)<br>
   b. [Coding challenges](#coding-challenges)<br>
   c. [Tools](#tools)<br>
4. [Team](#team)<br>

## Project idea

#### Concept

Technology is often perceived as invisible and untouchable, as something surreal that connects everyone even miles away. It is considered as what brings us the most towards the metaphysical, the mystical and the abnormal. Is it possible today to subtract the magical aura around the infinite connections that occur thanks to technology?
What we wanted to create is a website that, through a simple metaphor, imposes limitations on the usual use of technology. In fact, it sets temporal and spatial barriers that condition the experience within the website: users only perceive the presence of others if they are in the same spatial coordinates.
This is possible thanks to the collection of certain sensitive user data, in particular the gps position of anyone accessing the site is collected by the system, to trace the footprint of individual users and relate them to their neighbours. The aim is to create an engaging interactive experience to explain the complexity of the topic.

The world of Parasite consists of two subjects: parasites, which visually represent a place; and individual cells, the single user who access the website. A parasite is born only when a user creates the first cell in that specific place and it is enriched as other cells join it. When cells inhabit a parasite, they become colonies.

#### Context of use

The project is addressed to a wide audience, with no age limits; it is imagined that it will appeal especially to young people because they are more familiar with issues related to new technologies.
The site can be accessed at any time, groups of people in the same place can decide to create different cells to enrich the same colony. However, a person can access it independently to find out if other users have already left their trace in that place.

## Structure

#### Homepage

<br>
![Homepage](./links/Intro.gif)
<br>
The homepage is designed to present the project in its entirety in small parts. The landing page appears immediately interactive, as the movement of the background can be managed with the dynamic position of the mouse. In the centre there is the site logo, accompanied by the claim 'leave micro traces, trace macro limits', that appears with a delay of few seconds after the loading of the page. At the bottom right there is a call to action 'Go straight to the experience' that guides the user in the interaction.<br>
<br>
![homepage](links/PrimaInterfacciaMov.gif)
<br>
<br>Starting with the first scroll, there is an initial description of what Parasite represents and what the user is going to experience.<br>
<br>
![minigame](links/SecondaInterfaccia.gif)
<br>
 In the second scroll the qr code is presented,  inviting the users to begin their experience. Below the 'Go to the microverse' button takes the user to the archive section of the site.<br>
<br>
![minigame](links/TerzaInterfaccia.gif)
<br>
<br>The page is completed with a navbar emerging from the background with two buttons: Microverse (a further reminder of the archive) and About. Specifically, the About section appears as an overlay on the page in bright and vivid colours and provides detailed information about the project and the team. <br>
<br>
![minigame](links/About.gif)
<br>
<br>
#### Mobile Interface
After scanning the code on the landing page, the user arrives at the personalization page, designed for mobile. This interface consists of the logo at the top, a phrase welcoming the new cell to the world. The cell can be customized in its color and size by pressing the screen. In addition, the user can give it a name by filling in the name input. To send the cell to its parasite the person must shake the device.<br>
<br>
![waitingroom](links/Mobile.gif)
<br>
<br>
#### Microverse
The 'Microverse' section is the heart of the website. In fact, it provides an overview of all the parasites that have been created so far. It is constructed in a concentric manner: in the centre the user finds the parasite corresponding to his location, around which all the others are arranged. By clicking on each individual parasite, at the bottom left reference coordinates appear informing the user of the type of parasite, where and when it was created and who created the first cell.
Bottom right, accompained by the words 'slide to view neighbouring colonies', a zoom slider permits the user to enlarge the view of his or her own parasite. He/She arrives at his/her colony, where there are all the cells created by the different users orbiting the parasite. In this view, bottom left, the qr code appears again to invite anyone to create cells.<br>
<br>
![waitingroom](links/tablecloth.gif)
<br>
<br>

## The Code

#### Design challenges

Starting from the metaphor of microorganisms, a highly moldable generative form that could abstract that aesthetic was sought.
The chosen shape is created by overlapping distorted circles, filled in the core part and wireframed in the outer part.
A second element created are the cells of each individual user for which an aesthetic consistent with the parasite was pursued while still highlighting the hierarchical difference.
<br>
The site identity echoes the parasite aesthetic by using an organic wireframe font for the site name and icons.
The palette uses bright colors for accents and graphic elements and a neutral background.

#### Coding challenges

#### Tools

## Team

- [Maria Cecilia Buonocunto](mailto:)
- [Deborah Franceschini](mailto:dfranceschini18@gmail.com)
- [Stefano Gubiolo](mailto:stefano.gubiolo@gmail.com)
- [Matteo Visini](mailto:matteo.visini.99@gmail.com)
- [Giulia Zago](mailto:giulia.zago16@gmail.com)
