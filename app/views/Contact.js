import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Helmet from 'react-helmet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Main from '../layouts/Main';

import data from '../data/contact';
const Contact = () => (
  <Main>
    <section id="sidebar">
      <section id="intro">
        <Link to="/" className="logo">
          <img src={`${BASE_PATH}/images/chantelle_icon.jpg`} alt="" />
        </Link>
        <header>
          <h2>Casillas Law Group</h2>
          <p><a href="mailto:casillaslawgroup@gmail.com">casillaslawgroup@gmail.com</a></p>
        </header>
      </section>
    </section>

    <article className="post" id="index">
      <header>
        <div className="title">
          <h2><Link to="/">Sobre la Abogada</Link></h2>
          <p>Chantelle Casillas es la propietaria y fundadora de Casillas Law Group. Es hija de inmigrantes mexicanos nacidos en Los Angeles, California. La madre de Chantelle emigró a los Estados Unidos con una visa de estudiante con la esperanza de una vida mejor. </p><br></br>
          <p>Chantelle se graduó de la Universidad West Chester de Pensilvania en 2012 con una Licenciatura en Ciencias, especializándose en Ciencias Políticas y Español. Chantelle obtuvo su doctorado en jurisprudencia de Delaware Law School en Wilmington, Delaware. Mientras estaba en la escuela de derecho, Chantelle fue Vicepresidenta de la Asociación Latinoamericana de Estudiantes de Derecho, así como Vicepresidenta de la Sociedad Alternativa de Resolución de Controversias. Durante su tiempo en Delaware Law, Chantelle se despidió por la Fiscalía del Condado de Camden, la Oficina Legal de Meredith Brown (una boutique de Defensa de Inmigración en Glendale, California), y el Departamento de Seguridad Nacional, Inmigración y Control de Aduanas – en Filadelfia, Pensilvania. Mientras estaba en la escuela de derecho, Chantelle hizo Deans List, un reconocimiento especial otorgado a los estudiantes que se ubican en el 20% superior de todos los estudiantes en su año y división. </p><br></br>
          <p>Después de aprobar el Examen de Barras de Pensilvania en 2017, Chantelle acominó para el Honorable Morris G. Smith en la División Familiar, Camden, Nueva Jersey Vicinage. Durante su tiempo de trabajo, Chantelle estuvo expuesta a varias áreas del derecho de familia, y obtuvo una experiencia insuperable en la escritura legal. Después de que su período de trabajo de trabajo, Chantelle pasó a trabajar para una firma privada de Defensa de Inmigración en San Francisco, California. Después de trabajar en el bar privado, pasó a trabajar en el Departamento de Seguridad Nacional, Inmigración y Control de Aduanas en San Francisco, California durante un año, donde aprendió cómo funciona el gobierno. </p><br></br>
          <p>En 2017, Chantelle decidió que tenía suficiente experiencia para abrir su propia práctica. Ella se inspira constantemente en las historias de los inmigrantes que escucha a diario, y su voluntad de venir a los Estados Unidos en busca de una vida mejor para sus familias. Chantelle cree que los servicios de inmigración deben ser accesibles para todos a pesar de sus situaciones financieras o personales. Si necesita ayuda de defensa de inmigración, con mucho gusto estaríamos dispuestos a escuchar los detalles de su caso y evaluar si podemos ayudar. </p><br></br>
        </div>
      </header>
      <p> Welcome to my website. Please feel free to read more <Link to="/about">about me</Link>,
        or you can check out my {' '}
        <Link to="/resume">resume</Link>, {' '}
        <Link to="/projects">projects</Link>, {' '}
        view <Link to="/stats">site statistics</Link>, {' '}
        or <Link to="/contact">contact</Link> me.
      </p>
      <p> Source available <a href="https://github.com/messidagod/personal-site" target="_blank">here</a>.</p>
    </article>
  </Main>
);


export default Contact;
