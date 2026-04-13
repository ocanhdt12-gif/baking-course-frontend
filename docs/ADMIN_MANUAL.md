# CMS Admin Dashboard Manual

Welcome to Muka Bakery & Cooking Classes. This document is designed specifically from the **Frontend Website Perspective**. If you want to change any elements on the homepage, course pages, or articles, look for the corresponding section below to know exactly what to click in the Admin Dashboard.

> **LOGGING INTO THE SYSTEM:**
> Please visit the `/admin-login` (or `/login`) path with your Administrator account. The system will immediately redirect you to the internal dashboard `/admin`. Any changes made in the Admin will instantly reflect on the Website.

---

## 🏠 CHAPTER 1: MODIFYING HOMEPAGE DATA

### 1.1 Hero Header Slider
*The large, full-screen image block at the top of the homepage, featuring prominent text and an "Enroll Now" button, along with a countdown timer.*

* **Objective:** Change which image/post appears on the Banner, or showcase the newest course.
* **Where to manage in Admin:** `Manage Sliders`
* **How to execute:**
  - Scroll down to the `Available Programs` list (Courses not currently featured).
  - Click the green **[Add to Slider]** button under a course's image. 
* **Special Rules:**
  - That course will IMMEDIATELY be pinned to the top Slider on the Homepage.
  - However, a Maximum of 3 Courses are allowed on the Slider. You must click `[Remove from Slider]` on an old course to make room for a new one.
  - **Countdown Timer Slider:** Therefore, the Course featured on the Slider MUST have a *Class Session* scheduled in the future (e.g., tomorrow). If the opening date has passed, the system will lock it, label it yellow as `Started/No Date`, and prevent it from being featured!

### 1.2 Training Schedule (Timetable of Classes)
*The large block in the middle of the Homepage with 7 Tabs (Sunday, Monday...).*

* **Where to manage in Admin:** `Manage Programs` -> Click the Edit (Pencil) button on the course to open a class.
* **How to execute:**
  - On the Full-Screen Edit page, scroll down to the **Class Cohorts & Schedules** block.
  - Enter the **Day of Week** for the Schedule (e.g., Tuesday).
  - Click `[Save Program]`.
* **Result:** On the homepage, specifically in the 3rd Tab (Tuesday), a Course Card with the course's image, time, and instructor name will beautifully generate out of thin air. If you delete that schedule in Admin, the Card on the Homepage schedule will automatically disappear!

### 1.3 Quick Enrollment Form at the Bottom of Homepage
*The large text form with fields: Full Name, Email, Phone, Course Name.*

* **How it works:** When a user is on the **Course Details** page, selects a Class (e.g., Monday Class), and clicks **Enroll Now**, the system automatically scrolls down to this form.
* **Effect:** The Course Dropdown will automatically Autocomplete (pre-select) the exact Schedule and Name the user just viewed. Submit the Form immediately!
* **Where does the data go?:** Read `Chapter 4`.

---

## 🎓 CHAPTER 2: PROGRAMS LIST & DETAIL

### 2.1 Changing Image, Price, and Short Description
* **Where to manage in Admin:** `Manage Programs` -> The first block, `General Details`.
* **Key parameters:** You can upload a Cover Image URL. The `Instructor Name` can be the Chef's name you type in (e.g., Alexander Lamb). The system replaces everything completely as soon as you save.

### 2.2 Updating the Progress Bar (You Will Learn)
*These are horizontal progress bars running from 0% to 100% when entering the Course Detail page.*

* **Where to manage in Admin:** `Manage Programs` -> `You Will Learn` block.
* **Cool Feature:** Click `[+] Add Skill` to insert multiple knowledge areas (e.g., Mixing - 40%, Baking - 80%). The red column is for deleting. All those bars will render into a highly visual interface under the Description section on the Detail page.

### 2.3 Editing the Curriculum Accordion
*This is the collapsible interface; clicking Module 1 expands its content while collapsing other modules.*

* **Where to manage in Admin:** `Manage Programs` -> `Curriculum Overview` block.
* **Execution:** Don't panic about writing complex HTML code! Just click `[+] Add Module`, write the Lesson Title and Description. The server automatically normalizes and wraps it into the FrontEnd perfectly smoothly, just as the Designer intended!

### 2.4 Right Column Registration (Select Cohort Dropdown)
*End Users see a registration Menu board on the right side of the screen.*

* **Operating Principle:** The right column only displays courses with a `Start Date` greater than today inputted in the **Class Cohorts & Schedules** section (Manage Programs). Courses that have expired will automatically be hidden from the Menu.

---

## 📝 CHAPTER 3: ARTICLES (BLOG & JOURNALS)

### 3.1 Detailed Article Interface
*Beautiful blog posts styled like Journalistic layouts with bold text and expanding images.*

* **Where to manage in Admin:** `Manage Posts`.
* **Required Skills:** `Markdown` language. Type directly into the content box as follows:
  - **Bold Text:** Use `**Your Name**`.
  - **Italic Text:** Use `*Your Name*`.
  - **Add Attached Image:** `![Image alt text](http://imageurl.com)`.
  - You can easily drag the Status from `DRAFT` to `PUBLISHED` (to push it public onto the Blog bar).

### 3.2 Related Posts Block
*Located at the bottom of the article are 4 related reads.*
* **Server Mechanism:** When you select a `Category` (e.g., Teaching Class), the bottom column will automatically search and pull up the 4 newest articles in `Teaching Class` for guests to keep them reading! No manual selection needed.

---

## 👥 CHAPTER 4: ENROLLMENTS & CONTACTS

### 4.1 Course Enrollments
*Customers who just confirmed the Form at the bottom of the Home Page or from the Sidebar Enroll Button.*

* **Where to manage in Admin:** `Course Enrollments` (On the Left Menu tab).
* **Cash Flow Management:**
  - Registered customers will arrive with a **PENDING** status (Payment/Verification pending).
  - The Course Name is deeply split: *Example: Strawberry Cake Course (Wednesday • 11/25)*.
  - After your Sales staff confirms the Customer has received the Class and Paid Deposit/Transferred $\rightarrow$ Click directly on the Yellow Button! It will switch to a green **CONFIRMED** status. Extremely clear!
  - Delete spam forms created by Hackers without worrying about damaging any class storage systems.

### 4.2 Generic Mails
*Customers fill out in View Contact.jsx or the About page (About.jsx).*

* **Where to manage in Admin:** `Contact Messages`.
* **Management Method:** Very independent. You can reply via external email and regularly Clear Delete these mailboxes to make room for the server's Backbone Database.

***

This documentation is developed to serve content builders - Muka Baking Flow. The Editor team does not need to touch the source code. Wishing the system administrators success!
