<a id="readme-top"></a>

<!-- PROJECT SHIELDS -->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/mxte-b/nebula-manager">
    <img src="public/icon.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Nebula Manager</h3>

  <p align="center">
    A modern, hassle-free password manager that respects your privacy.
    <br />
    <br />
    <a href="https://github.com/mxte-b/nebula-manager/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    &middot;
    <a href="https://github.com/mxte-b/nebula-manager/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

Nebula Manager is a **cross-platform desktop password manager** designed for simplicity, speed, and privacy.  
It uses **local-first storage** with strong encryption, giving you full control over your data without sending anything to the cloud. Perfect for developers, privacy-conscious users, or anyone who wants a hassle-free vault.  

[![Product Name Screen Shot][product-screenshot]](https://example.com)

<p align="right">(<a href="#readme-top">back to top</a>)</p>


### Built With

* [![React][React.js]][React-url]
* [![TypeScript][TypeScript.ts]][TypeScript-url]
* [![SCSS][SCSS]][SCSS-url]
* [![Tauri][Tauri]][Tauri-url]
* [![Rust][Rust]][Rust-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

Follow these steps to set up the project locally for development.

### Prerequisites

Make sure you have the following installed:

* **Node.js / npm**
```sh
npm install npm@latest -g
```

* **Rust** (for Tauri builds)  
*Platform-specific instructions in the [Tauri docs](https://tauri.app/).*

### Installation

1. Clone the repository
```sh id="45fscy"
git clone https://github.com/mxte-b/nebula-manager.git
cd nebula-manager
```

2. Install dependencies
```sh id="on9eng"
npm install
```

3. Run in development mode
```sh id="5o2xvu"
npm run tauri dev
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

- Create a new vault or open an existing one.  
- Set a strong master password.  
- Add entries (username, password, URL, notes).  
- Organize entries into groups or tags.  
- Export/import vault files **only when necessary**; they are sensitive.  

_For more detailed usage examples, check the [Documentation](https://example.com)_

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ROADMAP -->
## Roadmap

- [ ] Secure import/export
- [ ] Application settings
- [ ] Version auto-migration
- [ ] UI/UX polish and accessibility updates

See the [open issues](https://github.com/mxte-b/nebula-manager/issues) for full feature list and known bugs.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTRIBUTING -->
## Contributing

Contributions make this project better! Any help — reporting issues, feature requests, or pull requests — is appreciated.  

Steps to contribute:

1. Fork the project
2. Create your feature branch:
```sh id="3refy4"
git checkout -b feature/AmazingFeature
```
3. Commit your changes:
```sh id="pbe402"
git commit -m "Add some AmazingFeature"
```
4. Push to your branch:
```sh id="uxrfmi"
git push origin feature/AmazingFeature
```
5. Open a pull request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Top contributors:

<a href="https://github.com/mxte-b/nebula-manager/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=mxte-b/nebula-manager" alt="contrib.rocks image" />
</a>


<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for details.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Website: [mxteb.dev](https://mxteb.dev)  
Email: hello@mxteb.dev
Project: [github.com/mxte-b/nebula-manager](https://github.com/mxte-b/nebula-manager)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

<!-- MARKDOWN LINKS & IMAGES -->
[contributors-shield]: https://img.shields.io/github/contributors/mxte-b/nebula-manager.svg?style=for-the-badge
[contributors-url]: https://github.com/mxte-b/nebula-b/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/mxte-b/nebula-manager.svg?style=for-the-badge
[forks-url]: https://github.com/mxte-b/nebula-manager/network/members
[stars-shield]: https://img.shields.io/github/stars/mxte-b/nebula-manager.svg?style=for-the-badge
[stars-url]: https://github.com/mxte-b/nebula-manager/stargazers
[issues-shield]: https://img.shields.io/github/issues/mxte-b/nebula-manager.svg?style=for-the-badge
[issues-url]: https://github.com/mxte-b/nebula-manager/issues
[license-shield]: https://img.shields.io/github/license/mxte-b/nebula-manager.svg?style=for-the-badge
[license-url]: https://github.com/mxte-b/nebula-manager/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/linkedin_username
[product-screenshot]: images/screenshot.png
[React.js]: https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black
[React-url]: https://reactjs.org/
[TypeScript.ts]: https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white
[TypeScript-url]: https://www.typescriptlang.org/
[Tauri]: https://img.shields.io/badge/Tauri-000000?style=for-the-badge&logo=tauri&logoColor=white
[Tauri-url]: https://tauri.app/
[Rust]: https://img.shields.io/badge/Rust-000000?style=for-the-badge&logo=rust&logoColor=white
[Rust-url]: https://www.rust-lang.org/
[SCSS]: https://img.shields.io/badge/SCSS-CC6699?style=for-the-badge&logo=sass&logoColor=white
[SCSS-url]: https://sass-lang.com/
