const { createApp, computed, ref, onMounted } = Vue;

createApp({
  setup() {
    const matches = ref([]);

    onMounted(async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const competitionId = urlParams.get('c');
      const blank = urlParams.has('blank');

      // const BASE_URL = 'https://api.reclub.co';
      const BASE_URL = 'http://localhost:3000';

      let fetchUrl = `${BASE_URL}/export/pickleball-scoresheets?c=${competitionId}`;
      if (blank) fetchUrl += '&blank';

      const response = await fetch(fetchUrl);
      const raw = await response.json();

      matches.value = raw.map(match => {
        const eventDate = new Date(match.eventTimestamp * 1000);

        const matchDatetime = match.matchTimestamp ? new Date(match.matchTimestamp * 1000) : null;
        const eventTime = matchDatetime?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })

        return {
          ...match,
          eventDate: eventDate?.toDateString() ?? '',
          matchTime: eventTime ?? ''
        };
      })

      console.log(matches.value)
    });

    return {
      matches
    };
  }
}).mount('#app');
