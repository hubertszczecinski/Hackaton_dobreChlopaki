# BRIDGE

**by Dobre Chłopaki**

BRIDGE is a prototype extension for the **Karta Łodzianina** application, designed during the **Łódź_Hack** hackathon.  
The goal of the project is to present a modern, interactive way of:

* visualizing urban development projects,  
* intelligently searching for city services,  
* improving residents’ experience through contextual information and AI.


https://www.canva.com/design/DAG6d6VGnJE/7IxrV03ciyX4oNa8FDBGCw/edit?utm_content=DAG6d6VGnJE&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton
[BRIDGE PRESENTATION]([https://uml.lodz.pl](https://www.canva.com/design/DAG6d6VGnJE/7IxrV03ciyX4oNa8FDBGCw/edit?utm_content=DAG6d6VGnJE&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)

## Key Features

### 1. “Łódź on the Map”: Interactive City Visualization

Our goal was to create an intuitive way to present urban investments.

**What the module offers:**

* An interactive **city map** (Leaflet + React-Leaflet)  
* Clearly presented **urban projects**, categorized by status:
  * 🟠 *Planned*  
  * 🟡 *In Progress* (with a progress bar)  
  * 🟢 *Completed*  
  * 🔵 *Community Initiatives* (with a voting option)  
* **Filtering** by status and category  
* Detailed **project cards** containing:
  * descriptions,  
  * implementation dates,  
  * “before / after” photos,  
  * detailed information  
* Subtle **UX animations** that enhance navigation

![alt text](solution_screenshots/lodz_na_mapie.png)  
![alt text](solution_screenshots/przed_i_po.png)

### 2. Intelligent Service Search (`/services`)

A modern, AI-powered search engine that allows residents to easily find services in the city.

**Key capabilities:**

* **AI semantic search (Google Gemini)**  
* Support for natural language queries, e.g.:  
  > “A place for a quiet evening with my partner”
* **Personalized service recommendations**  
* Results displayed **on a map**  
* **Location-based filtering**: address + radius  
* A full catalog of city services, including:
  * gastronomy,  
  * entertainment (cinemas, escape rooms, climbing gyms),  
  * automotive services (mechanics, EV chargers),  
  * healthcare, education,  
  * sports and recreation,  
  * coworking spaces and offices  

![alt text](solution_screenshots/uslugi.png)


## Technology

### Tech Stack

* **Framework:** Next.js 16.0.6 (App Router)  
* **Language:** TypeScript 5  
* **UI:** React 19.2.0  
* **Styling:** Tailwind CSS 4  
* **Maps:**  
  * Leaflet 1.9.4  
  * React-Leaflet 5.0.0  
* **Animations:** Framer Motion 12.23.25  
* **AI / ML:** Google Generative AI – Gemini 2.5 Flash Lite
