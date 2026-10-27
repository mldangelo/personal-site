---
title: Plant Disease Recognition System 🌿🔬
date: '2026-05-10'
description: 'An end-to-end deep learning project for automatic plant disease detection using leaf images. Built with a custom Convolutional Neural Network (CNN) and a Streamlit web interface.'
draft: true
---

<!-- # Plant Disease Recognition System 🌿🔬 -->

![Project gif](https://s14.gifyu.com/images/bTk4F.gif)


<br>
<!-- An end-to-end deep learning project for automatic plant disease detection using leaf images. Built with a custom Convolutional Neural Network (CNN) and a Streamlit web interface. -->

## Features

- Detects **38 classes** of healthy and diseased plant leaves (Apple, Tomato, Grape, Potato, etc.).
- **Streamlit Web App** for instant predictions from uploaded images.
- Trained on **87,000+ images** with >96% validation accuracy.
- **Pre-trained model included** for quick deployment.

---


## 📦 Project Code & Large Files

All code and large files are available in this Google Drive folder:<br>
[Click here to access the shared project files](https://drive.google.com/drive/folders/1FWhehho_y5P4HTrMOunl2deRl-xoy-E2?usp=sharing)


## Installation


### 1. Clone the repository
git clone https://github.com/premvaidya/Plants_Health.git
cd Plants_Health


### 2. Install dependencies
pip install -r requirements.txt

Common requirements:
streamlit
tensorflow
numpy
pandas
matplotlib
opencv-python


### 3. Model file
Ensure `trained_model.keras` is in your directory, or train using `Train_plant_disease.ipynb`.

---

## Usage

streamlit run main.py

- Open the provided link in your browser.
- Use the sidebar to navigate pages.

---

## Model Details

- **Input:** 128×128 color leaf images.
- **Architecture:** 10-layer CNN with dropout for regularization.
- **Optimizer:** Adam (`lr=0.0001`)
- **Loss:** Categorical Crossentropy
- **Accuracy:** ~99% training, ~96% validation.

---

## Dataset

- [New Plant Diseases Dataset](https://www.kaggle.com/datasets/vipoooool/new-plant-diseases-dataset) (~87k images, 38 categories).
- Split: Train (80%), Validation (20%), separate test set.

---


## Project Structure

Plants_Health/  <br>
├── main.py <br>
├── Train_plant_disease.ipynb <br>
├── Test_Plant_Disease.ipynb <br>
├── trained_model.keras <br>
├── training_hist.json <br>
├── home_page.jpg <br>
├── requirements.txt <br>
└── [data/ ...] <br>

---

## Acknowledgements

- Dataset by Vipoooool (Kaggle).
- Built with TensorFlow, Streamlit, and OpenCV.

---


**Keep our crops healthy and our planet green!**
<br>
<br>
<br>
