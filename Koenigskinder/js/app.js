const siteData = {
  events: [
    {
      day: "Datum",
      month: "Platzhalter",
      title: "Platzhalter: Jugendgottesdienst",
      place: "Platzhalter: Gemeinde, Stadt",
      time: "Platzhalter: Uhrzeit",
      type: "Öffentlich"
    },
    {
      day: "Datum",
      month: "Platzhalter",
      title: "Platzhalter: Camp-Abend",
      place: "Platzhalter: Freizeitort",
      time: "Platzhalter: Uhrzeit",
      type: "Anmeldung"
    },
    {
      day: "Datum",
      month: "Platzhalter",
      title: "Platzhalter: Lobpreisabend",
      place: "Platzhalter: Ort",
      time: "Platzhalter: Uhrzeit",
      type: "Öffentlich"
    }
  ],
  team: [
    { name: "Platzhalter: Name", role: "Platzhalter: Gesang", note: "Platzhalter: kurzer Satz zur Person." },
    { name: "Platzhalter: Name", role: "Platzhalter: Gitarre", note: "Platzhalter: kurzer Satz zur Person." },
    { name: "Platzhalter: Name", role: "Platzhalter: Keys", note: "Platzhalter: kurzer Satz zur Person." },
    { name: "Platzhalter: Name", role: "Platzhalter: Bass", note: "Platzhalter: kurzer Satz zur Person." },
    { name: "Platzhalter: Name", role: "Platzhalter: Drums", note: "Platzhalter: kurzer Satz zur Person." },
    { name: "Platzhalter: Name", role: "Platzhalter: Technik", note: "Platzhalter: kurzer Satz zur Person." }
  ],
  partners: [
    { name: "Platzhalter: Gemeinde", description: "Platzhalter: Proberaum, Jugendgottesdienste oder Support." },
    { name: "Platzhalter: Jugendwerk", description: "Platzhalter: Camps, Events oder gemeinsame Projekte." },
    { name: "Platzhalter: Technikpartner", description: "Platzhalter: Ton, Licht oder Equipment." }
  ],
  gallery: [
    { title: "Platzhalter: Livefoto", category: "Live", caption: "Platzhalter: Auftritt, Ort und Jahr." },
    { title: "Platzhalter: Bandportrait", category: "Band", caption: "Platzhalter: Namen oder Anlass." },
    { title: "Platzhalter: Probe", category: "Probe", caption: "Platzhalter: Proberaum oder Vorbereitung." },
    { title: "Platzhalter: Publikum", category: "Live", caption: "Platzhalter: Veranstaltung." },
    { title: "Platzhalter: Backstage", category: "Band", caption: "Platzhalter: kurzer Kontext." },
    { title: "Platzhalter: Songwriting", category: "Probe", caption: "Platzhalter: neuer Song oder Session." }
  ]
};

const setupNavigation = () => {
  const button = document.querySelector(".nav-toggle");
  const nav = document.querySelector("#site-nav");

  if (!button || !nav) return;

  button.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    button.setAttribute("aria-expanded", String(isOpen));
  });

  nav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      nav.classList.remove("is-open");
      button.setAttribute("aria-expanded", "false");
    }
  });
};

const setCurrentYear = () => {
  const year = String(new Date().getFullYear());

  document.querySelectorAll("[data-current-year]").forEach((element) => {
    element.textContent = year;
  });
};

const mountVueIsland = (selector, options) => {
  const root = document.querySelector(selector);
  const vue = window.Vue;

  if (!root || !vue) return;

  vue.createApp(options(root)).mount(root);
};

const mountEvents = () => {
  mountVueIsland('[data-vue="upcoming-events"]', (root) => {
    const limit = Number(root.dataset.limit || siteData.events.length);

    return {
      data() {
        return {
          events: siteData.events.slice(0, limit)
        };
      },
      template: `
        <article class="schedule-item" v-for="event in events" :key="event.title">
          <p class="date-box"><span>{{ event.month }}</span><strong>{{ event.day }}</strong></p>
          <div>
            <h3>{{ event.title }}</h3>
            <p>{{ event.place }}</p>
            <p class="event-meta">{{ event.time }} · {{ event.type }}</p>
          </div>
        </article>
      `
    };
  });

  mountVueIsland('[data-vue="events"]', () => ({
    data() {
      return {
        events: siteData.events
      };
    },
    template: `
      <article class="schedule-item" v-for="event in events" :key="event.title">
        <p class="date-box"><span>{{ event.month }}</span><strong>{{ event.day }}</strong></p>
        <div>
          <h2>{{ event.title }}</h2>
          <p>{{ event.place }}</p>
          <p class="event-meta">{{ event.time }} · {{ event.type }}</p>
        </div>
      </article>
    `
  }));
};

const mountTeam = () => {
  mountVueIsland('[data-vue="team"]', () => ({
    data() {
      return {
        team: siteData.team
      };
    },
    template: `
      <article class="person-card" v-for="person in team" :key="person.role">
        <div class="avatar-placeholder">Platzhalter: Foto</div>
        <div>
          <h3>{{ person.name }}</h3>
          <p>{{ person.role }}</p>
        </div>
        <p>{{ person.note }}</p>
      </article>
    `
  }));
};

const mountPartners = () => {
  mountVueIsland('[data-vue="partners"]', () => ({
    data() {
      return {
        partners: siteData.partners
      };
    },
    template: `
      <article class="partner-card" v-for="partner in partners" :key="partner.name">
        <div class="partner-logo">Platzhalter: Logo</div>
        <h2>{{ partner.name }}</h2>
        <p>{{ partner.description }}</p>
      </article>
    `
  }));
};

const mountGallery = () => {
  mountVueIsland('[data-vue="gallery"]', () => ({
    data() {
      return {
        activeCategory: "Alle",
        items: siteData.gallery
      };
    },
    computed: {
      categories() {
        return ["Alle", ...new Set(this.items.map((item) => item.category))];
      },
      filteredItems() {
        if (this.activeCategory === "Alle") return this.items;
        return this.items.filter((item) => item.category === this.activeCategory);
      }
    },
    template: `
      <div class="filter-row" aria-label="Galerie filtern">
        <button
          class="filter-button"
          type="button"
          v-for="category in categories"
          :key="category"
          :class="{ active: activeCategory === category }"
          :aria-pressed="String(activeCategory === category)"
          @click="activeCategory = category"
        >
          {{ category }}
        </button>
      </div>
      <div class="gallery-grid">
        <figure class="gallery-item" v-for="item in filteredItems" :key="item.title + item.category">
          <div class="photo-placeholder">{{ item.title }}</div>
          <figcaption>{{ item.caption }}</figcaption>
        </figure>
      </div>
    `
  }));
};

const mountContactForm = () => {
  mountVueIsland('[data-vue="contact-form"]', () => ({
    data() {
      return {
        status: "",
        form: {
          name: "",
          email: "",
          message: ""
        }
      };
    },
    methods: {
      submitForm() {
        if (!this.form.name || !this.form.email || !this.form.message) {
          this.status = "Bitte fülle alle Pflichtfelder aus.";
          return;
        }

        this.status = "Platzhalter: Formularversand mit echter E-Mail- oder Backend-Lösung verbinden.";
      }
    },
    template: `
      <form @submit.prevent="submitForm" novalidate>
        <div class="form-field">
          <label for="contact-name">Name</label>
          <input id="contact-name" v-model.trim="form.name" name="name" type="text" autocomplete="name" required>
        </div>
        <div class="form-field">
          <label for="contact-email">E-Mail</label>
          <input id="contact-email" v-model.trim="form.email" name="email" type="email" autocomplete="email" required>
        </div>
        <div class="form-field">
          <label for="contact-message">Nachricht</label>
          <textarea id="contact-message" v-model.trim="form.message" name="message" rows="6" required></textarea>
        </div>
        <button class="button button-primary" type="submit">Nachricht senden</button>
        <p class="form-status" role="status" aria-live="polite" v-if="status">{{ status }}</p>
      </form>
    `
  }));
};

document.addEventListener("DOMContentLoaded", () => {
  setupNavigation();
  setCurrentYear();
  mountEvents();
  mountTeam();
  mountPartners();
  mountGallery();
  mountContactForm();
});
