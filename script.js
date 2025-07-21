document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const calendarDays = document.getElementById('calendar-days');
    const monthYear = document.getElementById('month-year');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const prevYearBtn = document.getElementById('prev-year');
    const nextYearBtn = document.getElementById('next-year');
    const yearInput = document.getElementById('year-input');
    const eraSelector = document.getElementById('era-selector');
    const modal = document.getElementById('event-modal');
    const closeBtn = document.querySelector('.close-btn');
    const selectedDateEl = document.getElementById('selected-date');
    const eventList = document.getElementById('event-list');
    
    // Sidebar elements
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const newsCategory = document.getElementById('news-category');
    const refreshNewsBtn = document.getElementById('refresh-news');
    const newsContainer = document.getElementById('news-container');
    const festivalDate = document.getElementById('festival-date');
    const festivalsContainer = document.getElementById('festivals-container');
    const addNoteBtn = document.getElementById('add-note-btn');
    const noteModal = document.getElementById('add-note-modal');
    const closeNoteBtn = document.querySelector('.close-note-btn');
    const noteForm = document.getElementById('note-form');
    const notesContainer = document.getElementById('notes-container');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    // Date variables
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();
    let currentEra = 'present';
    
    // News API variables
    // Using SauravKanchan's NewsAPI which doesn't require an API key
    const newsApiUrl = 'https://saurav.tech/NewsAPI';
    let currentNewsCategory = 'general';
    let currentCountry = 'us'; // Default country code
    
    // Backup news API in case primary API fails
    const backupNewsApiUrl = 'https://saurav.tech/NewsAPI/everything';
    const sourcesList = ['bbc-news', 'cnn', 'fox-news', 'google-news'];
    
    // Personal notes array (stored in localStorage)
    let personalNotes = JSON.parse(localStorage.getItem('personalNotes')) || [];
    let currentFilter = 'all';
    
    // Event databases for different eras
    let historicalEvents = {};
    
    // Present Era events (1900-present)
    const presentEraEvents = {
        0: { // January
            1: [
                { year: 1863, title: "Emancipation Proclamation", description: "President Abraham Lincoln issued the Emancipation Proclamation, declaring slaves in Confederate states to be free." },
                { year: 1959, title: "Cuban Revolution", description: "Fidel Castro and his revolutionary forces successfully overthrew the Batista government in Cuba." },
                { year: 1999, title: "Euro Introduction", description: "The Euro was introduced as the official currency for electronic payments in 11 European countries." },
                { year: 2023, title: "Today's Significance", description: "New Year's Day - A day of new beginnings and resolutions worldwide." }
            ],
            15: [
                { year: 1929, title: "Birth of Martin Luther King Jr.", description: "Civil rights leader Martin Luther King Jr. was born in Atlanta, Georgia." },
                { year: 2001, title: "Wikipedia Launch", description: "Wikipedia, the free online encyclopedia, was launched on the internet." },
                { year: 2023, title: "Today's Significance", description: "Martin Luther King Jr. Day (observed) - Celebrating the civil rights leader's legacy." }
            ],
            27: [
                { year: 1945, title: "Liberation of Auschwitz", description: "Soviet troops liberated the Nazi concentration camp Auschwitz-Birkenau in Poland." },
                { year: 1967, title: "Apollo 1 Fire", description: "A fire in the Apollo 1 command module killed astronauts Gus Grissom, Ed White, and Roger Chaffee during a test." },
                { year: 2023, title: "Today's Significance", description: "International Holocaust Remembrance Day - Commemorating the victims of the Holocaust." }
            ]
        },
        1: { // February
            11: [
                { year: 1990, title: "Nelson Mandela Released", description: "Nelson Mandela was released from Victor Verster Prison after 27 years of imprisonment." },
                { year: 2023, title: "Today's Significance", description: "International Day of Women and Girls in Science - Promoting gender equality in science." }
            ],
            14: [
                { year: 1929, title: "St. Valentine's Day Massacre", description: "Seven members of Chicago's North Side Gang were murdered in a garage on Valentine's Day." },
                { year: 2023, title: "Today's Significance", description: "Valentine's Day - A celebration of love and affection between intimate companions." }
            ],
            24: [
                { year: 1582, title: "Gregorian Calendar Introduced", description: "Pope Gregory XIII issued a papal bull introducing the Gregorian calendar reform." },
                { year: 2022, title: "Russia-Ukraine War Begins", description: "Russia launched a full-scale invasion of Ukraine, beginning the largest conventional military attack in Europe since World War II." },
                { year: 2023, title: "Today's Significance", description: "One year anniversary of the Russia-Ukraine conflict." }
            ]
        },
        2: { // March
            8: [
                { year: 1917, title: "Russian Revolution Begins", description: "The February Revolution (according to the Julian calendar) began in Russia, leading to the abdication of Tsar Nicholas II." },
                { year: 2023, title: "Today's Significance", description: "International Women's Day - Celebrating women's achievements and promoting gender equality." }
            ],
            10: [
                { year: 1876, title: "First Telephone Call", description: "Alexander Graham Bell made the first successful telephone call, saying 'Mr. Watson, come here, I want to see you.'" },
                { year: 2023, title: "Today's Significance", description: "World Kidney Day (2nd Thursday in March) - Raising awareness about kidney health." }
            ],
            15: [
                { year: 44, title: "Ides of March", description: "Julius Caesar was assassinated by Roman senators, including his friend Brutus." },
                { year: 2023, title: "Today's Significance", description: "World Consumer Rights Day - Promoting the basic rights of consumers." }
            ],
            30: [
                { year: 1867, title: "Alaska Purchase", description: "The United States purchased Alaska from Russia for $7.2 million." },
                { year: 2023, title: "Today's Significance", description: "World Bipolar Day - Raising awareness about bipolar disorder." }
            ]
        },
        3: { // April
            1: [
                { year: 1976, title: "Apple Inc. Founded", description: "Steve Jobs, Steve Wozniak, and Ronald Wayne founded Apple Computer Company." },
                { year: 2023, title: "Today's Significance", description: "April Fools' Day - A day for pranks and hoaxes in many countries." }
            ],
            14: [
                { year: 1912, title: "Titanic Hits Iceberg", description: "The RMS Titanic struck an iceberg in the North Atlantic, beginning its tragic sinking." },
                { year: 2023, title: "Today's Significance", description: "World Chagas Disease Day - Raising awareness about this neglected tropical disease." }
            ],
            18: [
                { year: 1775, title: "Paul Revere's Ride", description: "Paul Revere made his famous midnight ride to warn colonists of British troops' advance." },
                { year: 2023, title: "Today's Significance", description: "International Day for Monuments and Sites - Celebrating the world's cultural heritage." }
            ],
            22: [
                { year: 1970, title: "First Earth Day", description: "The first Earth Day was celebrated, marking the birth of the modern environmental movement." },
                { year: 2023, title: "Today's Significance", description: "Earth Day - Annual event to demonstrate support for environmental protection." }
            ],
            26: [
                { year: 1986, title: "Chernobyl Disaster", description: "A catastrophic nuclear accident occurred at the Chernobyl Nuclear Power Plant in Ukraine." },
                { year: 2023, title: "Today's Significance", description: "International Chernobyl Disaster Remembrance Day - Commemorating the 1986 nuclear disaster." }
            ]
        },
        4: { // May
            1: [
                { year: 1931, title: "Empire State Building Opens", description: "The Empire State Building was dedicated in New York City, becoming the world's tallest building at that time." },
                { year: 2023, title: "Today's Significance", description: "International Workers' Day - Celebrating the achievements of workers worldwide." }
            ],
            8: [
                { year: 1945, title: "V-E Day", description: "Victory in Europe Day marked the formal acceptance by the Allies of Nazi Germany's unconditional surrender." },
                { year: 2023, title: "Today's Significance", description: "World Red Cross and Red Crescent Day - Honoring the humanitarian organization." }
            ],
            14: [
                { year: 1948, title: "Israel Declared Independence", description: "David Ben-Gurion, the Executive Head of the World Zionist Organization, declared the establishment of the State of Israel." },
                { year: 2023, title: "Today's Significance", description: "Mother's Day (US, varies by country) - Honoring mothers and motherhood." }
            ],
            25: [
                { year: 1961, title: "JFK's Moon Speech", description: "President John F. Kennedy announced before Congress the goal of landing a man on the Moon before the end of the decade." },
                { year: 2023, title: "Today's Significance", description: "Africa Day - Commemorating the founding of the Organisation of African Unity." }
            ]
        },
        5: { // June
            6: [
                { year: 1944, title: "D-Day", description: "Allied forces landed on the beaches of Normandy, France, beginning the liberation of Western Europe from Nazi control." },
                { year: 2023, title: "Today's Significance", description: "D-Day Anniversary - Commemorating the Normandy landings in World War II." }
            ],
            18: [
                { year: 1815, title: "Battle of Waterloo", description: "Napoleon Bonaparte was defeated at the Battle of Waterloo, ending his rule as Emperor of France." },
                { year: 2023, title: "Today's Significance", description: "Father's Day (US, varies by country) - Honoring fathers and fatherhood." }
            ],
            28: [
                { year: 1914, title: "Assassination of Archduke Franz Ferdinand", description: "Archduke Franz Ferdinand of Austria was assassinated, triggering a chain of events that led to World War I." },
                { year: 2023, title: "Today's Significance", description: "World Hepatitis Day - Raising awareness about viral hepatitis." }
            ]
        },
        6: { // July
            4: [
                { year: 1776, title: "U.S. Declaration of Independence", description: "The Continental Congress adopted the Declaration of Independence, announcing the colonies' separation from Great Britain." },
                { year: 2023, title: "Today's Significance", description: "Independence Day (US) - Celebrating the adoption of the Declaration of Independence." }
            ],
            14: [
                { year: 1789, title: "Storming of the Bastille", description: "Parisian revolutionaries stormed the Bastille prison, a pivotal event in the French Revolution." },
                { year: 2023, title: "Today's Significance", description: "Bastille Day - French National Day commemorating the Storming of the Bastille." }
            ],
            20: [
                { year: 1969, title: "Apollo 11 Moon Landing", description: "Neil Armstrong became the first human to step on the Moon, declaring it 'one small step for man, one giant leap for mankind.'" },
                { year: 2023, title: "Today's Significance", description: "Moon Landing Anniversary - Commemorating the first human landing on the Moon." }
            ]
        },
        7: { // August
            6: [
                { year: 1945, title: "Atomic Bombing of Hiroshima", description: "The United States dropped an atomic bomb on Hiroshima, Japan, the first use of a nuclear weapon in warfare." },
                { year: 2023, title: "Today's Significance", description: "Hiroshima Day - Commemorating the atomic bombing of Hiroshima." }
            ],
            15: [
                { year: 1947, title: "Indian Independence", description: "India gained independence from British rule after nearly 200 years of colonization." },
                { year: 2023, title: "Today's Significance", description: "Indian Independence Day - Celebrating India's independence from British rule." }
            ],
            24: [
                { year: 79, title: "Eruption of Mount Vesuvius", description: "Mount Vesuvius erupted, burying the Roman cities of Pompeii and Herculaneum under volcanic ash." },
                { year: 2023, title: "Today's Significance", description: "Ukrainian Independence Day - Celebrating Ukraine's declaration of independence from the Soviet Union in 1991." }
            ]
        },
        8: { // September
            1: [
                { year: 1939, title: "Germany Invades Poland", description: "Nazi Germany invaded Poland, marking the beginning of World War II in Europe." },
                { year: 2023, title: "Today's Significance", description: "World War II Anniversary - Marking the beginning of World War II in Europe." }
            ],
            11: [
                { year: 2001, title: "9/11 Terrorist Attacks", description: "Terrorists hijacked four commercial airplanes, crashing them into the World Trade Center, the Pentagon, and a field in Pennsylvania." },
                { year: 2023, title: "Today's Significance", description: "9/11 Remembrance Day - Commemorating the victims of the September 11 attacks." }
            ],
            17: [
                { year: 1787, title: "U.S. Constitution Signed", description: "The United States Constitution was signed by 39 delegates at the Constitutional Convention in Philadelphia." },
                { year: 2023, title: "Today's Significance", description: "Constitution Day (US) - Commemorating the formation and signing of the U.S. Constitution." }
            ]
        },
        9: { // October
            12: [
                { year: 1492, title: "Columbus Reaches the Americas", description: "Christopher Columbus's expedition made landfall in the Bahamas, initiating European exploration of the Americas." },
                { year: 2023, title: "Today's Significance", description: "Indigenous Peoples' Day/Columbus Day - Commemorating indigenous peoples and/or Columbus's arrival in the Americas." }
            ],
            24: [
                { year: 1945, title: "United Nations Founded", description: "The United Nations officially came into existence after the ratification of its charter by the five permanent members of the Security Council." },
                { year: 2023, title: "Today's Significance", description: "United Nations Day - Anniversary of the UN Charter coming into force." }
            ],
            29: [
                { year: 1929, title: "Stock Market Crash", description: "The U.S. stock market crashed, triggering the Great Depression, the worst economic crisis of the 20th century." },
                { year: 2023, title: "Today's Significance", description: "World Stroke Day - Raising awareness about stroke prevention and treatment." }
            ],
            31: [
                { year: 1517, title: "Protestant Reformation Begins", description: "Martin Luther posted his Ninety-five Theses on the door of All Saints' Church in Wittenberg, initiating the Protestant Reformation." },
                { year: 2023, title: "Today's Significance", description: "Halloween - A celebration observed in many countries on the eve of the Western Christian feast of All Hallows' Day." }
            ]
        },
        10: { // November
            9: [
                { year: 1989, title: "Fall of the Berlin Wall", description: "The Berlin Wall fell, symbolizing the end of the Cold War and the beginning of German reunification." },
                { year: 2023, title: "Today's Significance", description: "Berlin Wall Fall Anniversary - Commemorating the fall of the Berlin Wall." }
            ],
            11: [
                { year: 1918, title: "World War I Armistice", description: "An armistice was signed between the Allies and Germany, effectively ending World War I." },
                { year: 2023, title: "Today's Significance", description: "Veterans Day (US)/Remembrance Day (Commonwealth) - Honoring military veterans." }
            ],
            22: [
                { year: 1963, title: "JFK Assassination", description: "President John F. Kennedy was assassinated while riding in a motorcade in Dallas, Texas." },
                { year: 2023, title: "Today's Significance", description: "JFK Assassination Anniversary - Remembering the assassination of President Kennedy." }
            ]
        },
        11: { // December
            7: [
                { year: 1941, title: "Pearl Harbor Attack", description: "Japanese forces launched a surprise attack on the U.S. naval base at Pearl Harbor, Hawaii, leading to America's entry into World War II." },
                { year: 2023, title: "Today's Significance", description: "Pearl Harbor Remembrance Day - Commemorating the attack on Pearl Harbor." }
            ],
            10: [
                { year: 1901, title: "First Nobel Prizes Awarded", description: "The first Nobel Prizes were awarded in Stockholm, Sweden, on the fifth anniversary of Alfred Nobel's death." },
                { year: 2023, title: "Today's Significance", description: "Human Rights Day - Commemorating the adoption of the Universal Declaration of Human Rights." }
            ],
            25: [
                { year: 336, title: "First Christmas Celebration", description: "The first recorded celebration of Christmas on December 25 took place in Rome under Emperor Constantine." },
                { year: 2023, title: "Today's Significance", description: "Christmas Day - Celebrating the birth of Jesus Christ, observed by billions worldwide." }
            ],
            31: [
                { year: 1999, title: "Y2K Preparations", description: "The world prepared for potential computer problems as the year changed from 1999 to 2000, known as the Y2K bug." },
                { year: 2023, title: "Today's Significance", description: "New Year's Eve - Celebrations and gatherings to mark the end of the year." }
            ]
        }
    };
    
    // Ancient History events (5000 BCE - 1900 CE)
    const ancientEraEvents = {
        0: { // January
            1: [
                { year: -3000, title: "Early Egyptian Calendar", description: "Ancient Egyptians began using a solar calendar with 365 days, one of the first civilizations to do so." },
                { year: 1, title: "Julian Calendar Adoption", description: "The Julian calendar, introduced by Julius Caesar, came into effect throughout the Roman Empire." },
                { year: 2023, title: "Today's Significance", description: "New Year's Day - Celebrated worldwide as the beginning of a new calendar year." }
            ],
            15: [
                { year: 1559, title: "Elizabeth I Crowned", description: "Elizabeth I was crowned Queen of England in Westminster Abbey, beginning the Elizabethan era." },
                { year: 2023, title: "Today's Significance", description: "World Religion Day - Celebrating the common principles shared by all religions." }
            ],
            30: [
                { year: -1649, title: "King Charles I Executed", description: "King Charles I of England was executed for treason, marking a pivotal moment in English history." },
                { year: 2023, title: "Today's Significance", description: "Martyrs' Day - Commemorating the assassination of Mahatma Gandhi in 1948." }
            ]
        },
        1: { // February
            14: [
                { year: 270, title: "St. Valentine's Martyrdom", description: "Saint Valentine, a Roman priest, was martyred, later becoming associated with the celebration of love." },
                { year: 2023, title: "Today's Significance", description: "Valentine's Day - Celebrating love and affection between intimate companions." }
            ],
            24: [
                { year: -1582, title: "Gregorian Calendar Introduced", description: "Pope Gregory XIII introduced the Gregorian calendar, which is the most widely used calendar today." },
                { year: 2023, title: "Today's Significance", description: "World Sustainable Energy Day - Raising awareness about sustainable energy use." }
            ]
        },
        2: { // March
            15: [
                { year: -44, title: "Assassination of Julius Caesar", description: "Julius Caesar was assassinated by Roman senators, including his friend Brutus, on the Ides of March." },
                { year: 2023, title: "Today's Significance", description: "World Consumer Rights Day - Promoting the basic rights of all consumers." }
            ],
            27: [
                { year: 1513, title: "Ponce de León Discovers Florida", description: "Spanish explorer Juan Ponce de León first sighted Florida, claiming it for Spain." },
                { year: 2023, title: "Today's Significance", description: "World Theater Day - Celebrating the art form of theater across all countries." }
            ]
        },
        3: { // April
            11: [
                { year: 1814, title: "Napoleon Abdicates", description: "Napoleon Bonaparte abdicated as Emperor of France and was exiled to the island of Elba." },
                { year: 2023, title: "Today's Significance", description: "World Parkinson's Day - Raising awareness about Parkinson's disease." }
            ],
            22: [
                { year: -753, title: "Rome Founded", description: "According to legend, Romulus founded the city of Rome, which would become the center of one of history's greatest empires." },
                { year: 2023, title: "Today's Significance", description: "Earth Day - Demonstrating support for environmental protection." }
            ]
        },
        4: { // May
            1: [
                { year: 1707, title: "Great Britain Formed", description: "The Acts of Union joined the kingdoms of England and Scotland to form Great Britain." },
                { year: 2023, title: "Today's Significance", description: "International Workers' Day - Celebrating the achievements of workers worldwide." }
            ],
            24: [
                { year: 1844, title: "First Telegraph Message", description: "Samuel Morse sent the first telegraph message: 'What hath God wrought?' from Washington, D.C. to Baltimore." },
                { year: 2023, title: "Today's Significance", description: "European Day of Parks - Celebrating protected areas across Europe." }
            ]
        },
        5: { // June
            5: [
                { year: 1215, title: "Magna Carta Sealed", description: "King John of England sealed the Magna Carta, a document that limited the power of the monarch and established important legal principles." },
                { year: 2023, title: "Today's Significance", description: "World Environment Day - Encouraging worldwide awareness and action for environmental protection." }
            ],
            18: [
                { year: 1815, title: "Battle of Waterloo", description: "Napoleon Bonaparte was defeated at the Battle of Waterloo by British and Prussian forces, ending his rule as Emperor of France." },
                { year: 2023, title: "Today's Significance", description: "International Picnic Day - Encouraging people to gather outdoors for a meal." }
            ]
        },
        6: { // July
            4: [
                { year: 1776, title: "U.S. Declaration of Independence", description: "The Continental Congress adopted the Declaration of Independence, announcing the colonies' separation from Great Britain." },
                { year: 2023, title: "Today's Significance", description: "Independence Day (USA) - Commemorating the adoption of the Declaration of Independence." }
            ],
            14: [
                { year: 1789, title: "Storming of the Bastille", description: "Parisian revolutionaries stormed the Bastille prison, a pivotal event in the French Revolution." },
                { year: 2023, title: "Today's Significance", description: "Bastille Day - The national day of France, commemorating the storming of the Bastille." }
            ]
        },
        7: { // August
            24: [
                { year: 79, title: "Eruption of Mount Vesuvius", description: "Mount Vesuvius erupted, burying the Roman cities of Pompeii and Herculaneum under volcanic ash." },
                { year: 2023, title: "Today's Significance", description: "International Strange Music Day - Encouraging people to listen to new and different types of music." }
            ],
            29: [
                { year: 1533, title: "Pizarro Executes Last Inca Emperor", description: "Spanish conquistador Francisco Pizarro executed Atahualpa, the last sovereign emperor of the Inca Empire." },
                { year: 2023, title: "Today's Significance", description: "International Day Against Nuclear Tests - Raising awareness about the effects of nuclear weapon tests." }
            ]
        },
        8: { // September
            2: [
                { year: 31, title: "Battle of Actium", description: "Octavian (later Emperor Augustus) defeated Mark Antony and Cleopatra in a naval battle, leading to the final establishment of the Roman Empire." },
                { year: 2023, title: "Today's Significance", description: "World Coconut Day - Promoting awareness about the importance of coconuts." }
            ],
            17: [
                { year: 1787, title: "U.S. Constitution Signed", description: "The United States Constitution was signed in Philadelphia, establishing the framework of the U.S. government." },
                { year: 2023, title: "Today's Significance", description: "Constitution Day (USA) - Commemorating the formation and signing of the U.S. Constitution." }
            ]
        },
        9: { // October
            14: [
                { year: 1066, title: "Battle of Hastings", description: "William the Conqueror defeated King Harold II at the Battle of Hastings, leading to Norman conquest of England." },
                { year: 2023, title: "Today's Significance", description: "World Standards Day - Paying tribute to the collaborative efforts of experts who develop technical standards." }
            ],
            31: [
                { year: 1517, title: "Martin Luther's 95 Theses", description: "Martin Luther posted his 95 Theses on the door of Wittenberg Castle Church, sparking the Protestant Reformation." },
                { year: 2023, title: "Today's Significance", description: "Halloween - A celebration observed in many countries, dedicated to remembering the dead." }
            ]
        },
        10: { // November
            11: [
                { year: 1918, title: "World War I Armistice", description: "The Armistice of Compiègne was signed, ending fighting in World War I." },
                { year: 2023, title: "Today's Significance", description: "Veterans Day/Remembrance Day - Honoring military veterans who served in the armed forces." }
            ],
            17: [
                { year: 1869, title: "Suez Canal Opens", description: "The Suez Canal, connecting the Mediterranean and Red Seas, was inaugurated after 10 years of construction." },
                { year: 2023, title: "Today's Significance", description: "International Students' Day - Commemorating the anniversary of the Nazi storming of Czech universities in 1939." }
            ]
        },
        11: { // December
            25: [
                { year: 336, title: "First Christmas Celebration", description: "The first recorded celebration of Christmas on December 25 took place in Rome under Emperor Constantine." },
                { year: 2023, title: "Today's Significance", description: "Christmas Day - Celebrating the birth of Jesus Christ, observed by billions worldwide." }
            ],
            31: [
                { year: 1600, title: "East India Company Founded", description: "The British East India Company was founded, which would later rule large parts of the Indian subcontinent." },
                { year: 2023, title: "Today's Significance", description: "New Year's Eve - Celebrations and gatherings to mark the end of the year." }
            ]
        }
    };
    
    // Prehistoric Era events (200,000 BCE - 5000 BCE)
    const prehistoricEraEvents = {
        0: { // January
            1: [
                { year: -10000, title: "Agricultural Revolution Begins", description: "Early humans began transitioning from hunting and gathering to agriculture in the Fertile Crescent." },
                { year: 2023, title: "Today's Significance", description: "New Year's Day - Celebrated worldwide as the beginning of a new calendar year." }
            ],
            15: [
                { year: -40000, title: "Cave Paintings", description: "Early humans created sophisticated cave paintings in Europe, showing advanced artistic capabilities." },
                { year: 2023, title: "Today's Significance", description: "World Religion Day - Celebrating the common principles shared by all religions." }
            ],
            25: [
                { year: -8000, title: "First Domesticated Dogs", description: "Evidence suggests humans had domesticated dogs by this time, creating the first animal-human partnership." },
                { year: 2023, title: "Today's Significance", description: "Burns Night - Celebrating the life and poetry of Robert Burns, the national poet of Scotland." }
            ]
        },
        1: { // February
            10: [
                { year: -15000, title: "Oldest Known Pottery", description: "The oldest known pottery was created in China, predating agricultural societies." },
                { year: 2023, title: "Today's Significance", description: "World Pulses Day - Recognizing the importance of pulses (dried beans, lentils, etc.) as a global food." }
            ],
            28: [
                { year: -20000, title: "Peak of Last Ice Age", description: "The Last Glacial Maximum occurred, with ice sheets covering much of North America and Europe." },
                { year: 2023, title: "Today's Significance", description: "Rare Disease Day - Raising awareness for rare diseases and their impact on patients' lives." }
            ]
        },
        3: { // April
            5: [
                { year: -9000, title: "Jericho Founded", description: "Jericho, one of the oldest continuously inhabited cities in the world, was established." },
                { year: 2023, title: "Today's Significance", description: "First Contact Day - Celebrated by Star Trek fans as the future date of humanity's first contact with Vulcans." }
            ],
            22: [
                { year: -30000, title: "Oldest Known Musical Instruments", description: "The oldest known musical instruments, flutes made from bird bone and mammoth ivory, were created in Europe." },
                { year: 2023, title: "Today's Significance", description: "Earth Day - Demonstrating support for environmental protection." }
            ]
        },
        5: { // June
            1: [
                { year: -7000, title: "First Pottery", description: "Early humans in East Asia developed pottery, one of the first synthetic materials ever created." },
                { year: 2023, title: "Today's Significance", description: "Global Day of Parents - Honoring parents throughout the world." }
            ],
            15: [
                { year: -6500, title: "Çatalhöyük at its Peak", description: "The Neolithic settlement of Çatalhöyük in Turkey reached its peak, one of the world's earliest large human settlements." },
                { year: 2023, title: "Today's Significance", description: "World Elder Abuse Awareness Day - Focusing global attention on the problem of physical, emotional, and financial abuse of elders." }
            ]
        },
        7: { // August
            10: [
                { year: -150000, title: "Homo Sapiens Emerge", description: "Modern humans (Homo sapiens) first appeared in Africa, beginning the story of our species." },
                { year: 2023, title: "Today's Significance", description: "World Lion Day - Raising awareness about the declining population of lions worldwide." }
            ],
            20: [
                { year: -50000, title: "Human Migration to Australia", description: "Humans first migrated to Australia, crossing the ocean and becoming the first people to settle a continent that had never been touched by humans." },
                { year: 2023, title: "Today's Significance", description: "World Mosquito Day - Commemorating the discovery of the link between mosquitoes and malaria transmission." }
            ]
        },
        9: { // October
            15: [
                { year: -25000, title: "Venus of Willendorf Created", description: "The Venus of Willendorf, one of the oldest known representations of the human form, was created." },
                { year: 2023, title: "Today's Significance", description: "Global Handwashing Day - Increasing awareness about the importance of handwashing with soap." }
            ],
            31: [
                { year: -35000, title: "Neanderthals Begin to Disappear", description: "Neanderthals began to disappear from Europe, eventually becoming extinct as Homo sapiens became the dominant human species." },
                { year: 2023, title: "Today's Significance", description: "Halloween - A celebration observed in many countries, dedicated to remembering the dead." }
            ]
        },
        11: { // December
            21: [
                { year: -12000, title: "End of Ice Age", description: "The last major ice age began to end, leading to rising sea levels and changing global landscapes." },
                { year: 2023, title: "Today's Significance", description: "Winter Solstice - The shortest day of the year in the Northern Hemisphere, celebrated by many cultures." }
            ],
            31: [
                { year: -5500, title: "First Evidence of Copper Smelting", description: "The first evidence of copper smelting appears in the archaeological record, marking the beginning of metallurgy." },
                { year: 2023, title: "Today's Significance", description: "New Year's Eve - Celebrations and gatherings to mark the end of the year." }
            ]
        }
    };
    
    // Geological Time events (4.6 billion BCE - 200,000 BCE)
    const geologicalEraEvents = {
        0: { // January
            1: [
                { year: -4600000000, title: "Earth Forms", description: "The planet Earth formed from the solar nebula, beginning its geological history." },
                { year: 2023, title: "Today's Significance", description: "New Year's Day - Celebrated worldwide as the beginning of a new calendar year." }
            ],
            15: [
                { year: -3800000000, title: "First Life Appears", description: "The first simple life forms appeared on Earth, possibly near hydrothermal vents in the ocean." },
                { year: 2023, title: "Today's Significance", description: "World Religion Day - Celebrating the common principles shared by all religions." }
            ],
            25: [
                { year: -2500000000, title: "Great Oxygenation Event", description: "Cyanobacteria produced oxygen through photosynthesis, dramatically changing Earth's atmosphere and allowing for the evolution of complex life." },
                { year: 2023, title: "Today's Significance", description: "Burns Night - Celebrating the life and poetry of Robert Burns, the national poet of Scotland." }
            ]
        },
        1: { // February
            14: [
                { year: -600000000, title: "Ediacaran Period Begins", description: "The Ediacaran period began, featuring the first complex multicellular organisms in Earth's history." },
                { year: 2023, title: "Today's Significance", description: "Valentine's Day - Celebrating love and affection between intimate companions." }
            ],
            28: [
                { year: -540000000, title: "Cambrian Explosion", description: "The Cambrian Explosion occurred, a period when most major animal phyla appeared in the fossil record, dramatically diversifying life on Earth." },
                { year: 2023, title: "Today's Significance", description: "Rare Disease Day - Raising awareness for rare diseases and their impact on patients' lives." }
            ]
        },
        2: { // March
            1: [
                { year: -252000000, title: "Permian-Triassic Extinction", description: "The largest mass extinction in Earth's history occurred, wiping out about 96% of marine species and 70% of terrestrial vertebrates." },
                { year: 2023, title: "Today's Significance", description: "Zero Discrimination Day - Promoting equality before the law." }
            ],
            20: [
                { year: -230000000, title: "First Dinosaurs Appear", description: "The first dinosaurs appeared during the Triassic period, beginning the age of dinosaurs that would last for over 165 million years." },
                { year: 2023, title: "Today's Significance", description: "International Day of Happiness - Recognizing the importance of happiness in people's lives." }
            ]
        },
        3: { // April
            22: [
                { year: -375000000, title: "First Land Vertebrates", description: "The first vertebrates began to colonize land, evolving from lobe-finned fish into early tetrapods." },
                { year: 2023, title: "Today's Significance", description: "Earth Day - Demonstrating support for environmental protection." }
            ],
            30: [
                { year: -320000000, title: "Carboniferous Period", description: "During the Carboniferous period, vast forests covered the land, eventually forming coal deposits that would fuel the Industrial Revolution millions of years later." },
                { year: 2023, title: "Today's Significance", description: "International Jazz Day - Celebrating jazz and its diplomatic role of uniting people around the world." }
            ]
        },
        4: { // May
            15: [
                { year: -200000000, title: "Pangaea Begins to Break Apart", description: "The supercontinent Pangaea began to break apart, eventually forming the continents we know today." },
                { year: 2023, title: "Today's Significance", description: "International Day of Families - Promoting awareness of issues relating to families." }
            ],
            31: [
                { year: -145000000, title: "Jurassic Period Ends", description: "The Jurassic period ended, transitioning into the Cretaceous period, the final era of the dinosaurs." },
                { year: 2023, title: "Today's Significance", description: "World No Tobacco Day - Drawing attention to the health problems tobacco use can cause." }
            ]
        },
        5: { // June
            1: [
                { year: -65000000, title: "Dinosaur Extinction", description: "An asteroid impact led to the extinction of non-avian dinosaurs and many other species, ending the Cretaceous period." },
                { year: 2023, title: "Today's Significance", description: "Global Day of Parents - Honoring parents throughout the world." }
            ],
            21: [
                { year: -50000000, title: "Early Primates Evolve", description: "Early primates evolved, eventually leading to the emergence of the human lineage." },
                { year: 2023, title: "Today's Significance", description: "World Music Day - Celebrating music in all its forms and the impact it has on the world." }
            ]
        },
        6: { // July
            10: [
                { year: -35000000, title: "Antarctica Freezes Over", description: "Antarctica became covered in ice as global temperatures dropped, creating the ice cap that still exists today." },
                { year: 2023, title: "Today's Significance", description: "Nikola Tesla Day - Celebrating the birth of the inventor and electrical engineer." }
            ],
            25: [
                { year: -20000000, title: "African-Arabian Collision", description: "The African and Arabian tectonic plates collided with Eurasia, forming the Alpine mountain ranges including the Alps and the Himalayas." },
                { year: 2023, title: "Today's Significance", description: "World Drowning Prevention Day - Highlighting the tragic and profound impact of drowning." }
            ]
        },
        7: { // August
            1: [
                { year: -2500000, title: "Ice Age Begins", description: "The current ice age (Quaternary glaciation) began, characterized by alternating glacial and interglacial periods." },
                { year: 2023, title: "Today's Significance", description: "World Wide Web Day - Celebrating the invention of the World Wide Web." }
            ],
            15: [
                { year: -1800000, title: "Homo Erectus Appears", description: "Homo erectus, an early human ancestor, appeared in Africa and spread throughout much of the Old World." },
                { year: 2023, title: "Today's Significance", description: "Indian Independence Day - Commemorating India's independence from British rule." }
            ]
        },
        8: { // September
            10: [
                { year: -1000000, title: "First Control of Fire", description: "Early humans first controlled fire, a crucial step in human evolution that allowed for cooking food and protection from predators." },
                { year: 2023, title: "Today's Significance", description: "World Suicide Prevention Day - Raising awareness that suicide can be prevented." }
            ],
            30: [
                { year: -500000, title: "Homo Heidelbergensis Emerges", description: "Homo heidelbergensis emerged, a likely ancestor to both Homo sapiens and Neanderthals." },
                { year: 2023, title: "Today's Significance", description: "International Translation Day - Paying tribute to the work of language professionals." }
            ]
        },
        9: { // October
            1: [
                { year: -200000, title: "Neanderthals Emerge", description: "Neanderthals emerged in Europe and Western Asia, a human species that would later coexist with Homo sapiens." },
                { year: 2023, title: "Today's Significance", description: "International Day of Older Persons - Recognizing the contributions of older persons and examining issues that affect their lives." }
            ],
            31: [
                { year: -300000, title: "Oldest Known Stone Tools", description: "The oldest known stone tools were created by early humans, marking the beginning of human technology." },
                { year: 2023, title: "Today's Significance", description: "Halloween - A celebration observed in many countries, dedicated to remembering the dead." }
            ]
        },
        10: { // November
            15: [
                { year: -400000, title: "First Evidence of Controlled Fire", description: "The first evidence of controlled use of fire by early humans appears in the archaeological record." },
                { year: 2023, title: "Today's Significance", description: "America Recycles Day - Encouraging Americans to recycle and buy recycled products." }
            ],
            30: [
                { year: -250000, title: "Homo Sapiens Evolves in Africa", description: "Homo sapiens evolved in Africa, eventually becoming the only surviving human species." },
                { year: 2023, title: "Today's Significance", description: "Computer Security Day - Raising awareness about computer security issues." }
            ]
        },
        11: { // December
            10: [
                { year: -3000000000, title: "Photosynthesis Evolves", description: "Photosynthesis evolved in bacteria, allowing organisms to convert sunlight into energy and producing oxygen as a byproduct." },
                { year: 2023, title: "Today's Significance", description: "Human Rights Day - Commemorating the adoption of the Universal Declaration of Human Rights." }
            ],
            31: [
                { year: -4000000000, title: "Late Heavy Bombardment", description: "The Late Heavy Bombardment occurred, a period when a large number of asteroids hit the inner solar system, including Earth and the Moon." },
                { year: 2023, title: "Today's Significance", description: "New Year's Eve - Celebrations and gatherings to mark the end of the year." }
            ]
        }
    };
    
    // Cosmic Events (13.8 billion BCE - 4.6 billion BCE)
    const cosmicEraEvents = {
        0: { // January
            1: [
                { year: -13800000000, title: "Big Bang", description: "The universe began with the Big Bang, the event that created all matter, energy, space, and time." },
                { year: 2023, title: "Today's Significance", description: "New Year's Day - Celebrated worldwide as the beginning of a new calendar year." }
            ],
            15: [
                { year: -13400000000, title: "First Stars Form", description: "The first stars began to form in the universe, ending the cosmic dark ages." },
                { year: 2023, title: "Today's Significance", description: "World Religion Day - Celebrating the common principles shared by all religions." }
            ],
            30: [
                { year: -13200000000, title: "First Elements Beyond Hydrogen and Helium", description: "The first stars began to produce heavier elements through nuclear fusion, eventually creating all the elements necessary for life." },
                { year: 2023, title: "Today's Significance", description: "World Leprosy Day - Raising awareness of a disease that many people believe is extinct." }
            ]
        },
        1: { // February
            14: [
                { year: -12000000000, title: "First Supernova Explosions", description: "The first massive stars reached the end of their lives and exploded as supernovae, dispersing heavy elements throughout the universe." },
                { year: 2023, title: "Today's Significance", description: "Valentine's Day - Celebrating love and affection between intimate companions." }
            ],
            28: [
                { year: -11000000000, title: "Galaxies Begin to Cluster", description: "Galaxies began to form clusters and superclusters, creating the large-scale structure of the universe we see today." },
                { year: 2023, title: "Today's Significance", description: "Rare Disease Day - Raising awareness for rare diseases and their impact on patients' lives." }
            ]
        },
        3: { // April
            1: [
                { year: -13000000000, title: "First Galaxies Form", description: "The first galaxies began to form as gravity pulled matter together into large structures." },
                { year: 2023, title: "Today's Significance", description: "April Fools' Day - A day for playing practical jokes and spreading hoaxes." }
            ],
            22: [
                { year: -10000000000, title: "Milky Way Galaxy Forms", description: "Our Milky Way galaxy began to form, eventually becoming the spiral galaxy we know today." },
                { year: 2023, title: "Today's Significance", description: "Earth Day - Demonstrating support for environmental protection." }
            ]
        },
        4: { // May
            12: [
                { year: -8000000000, title: "First Sun-like Stars", description: "The first Sun-like stars formed in the universe, potentially hosting planetary systems similar to our own." },
                { year: 2023, title: "Today's Significance", description: "International Nurses Day - Celebrating the contributions nurses make to society." }
            ],
            25: [
                { year: -7000000000, title: "Universe Expansion Accelerates", description: "The expansion of the universe began to accelerate due to the influence of dark energy, a mysterious force that counteracts gravity." },
                { year: 2023, title: "Today's Significance", description: "Towel Day - Tribute to author Douglas Adams, celebrated by fans of The Hitchhiker's Guide to the Galaxy." }
            ]
        },
        5: { // June
            8: [
                { year: -6000000000, title: "First Planetary Systems", description: "The first planetary systems began to form around stars, as dust and gas in protoplanetary disks coalesced into planets." },
                { year: 2023, title: "Today's Significance", description: "World Oceans Day - Raising awareness of the vital importance of oceans and the role they play in sustaining life on Earth." }
            ],
            21: [
                { year: -5500000000, title: "Local Group Forms", description: "The Local Group, the galaxy group that includes the Milky Way, began to form as a gravitationally bound system." },
                { year: 2023, title: "Today's Significance", description: "World Music Day - Celebrating music in all its forms and the impact it has on the world." }
            ]
        },
        6: { // July
            1: [
                { year: -4600000000, title: "Solar System Forms", description: "Our solar system began to form from a giant molecular cloud, eventually leading to the birth of the Sun and planets." },
                { year: 2023, title: "Today's Significance", description: "International Joke Day - A day to celebrate jokes and laughter." }
            ],
            20: [
                { year: -4570000000, title: "Sun Ignites", description: "The Sun ignited its nuclear fusion reactions, beginning its life as a main sequence star." },
                { year: 2023, title: "Today's Significance", description: "Moon Day - Commemorating the first human landing on the Moon in 1969." }
            ]
        },
        7: { // August
            11: [
                { year: -4560000000, title: "Proto-Planetary Disk Forms", description: "A disk of gas and dust formed around the young Sun, from which the planets would eventually form." },
                { year: 2023, title: "Today's Significance", description: "Play in the Sand Day - Encouraging creative play with sand." }
            ],
            24: [
                { year: -4550000000, title: "First Planetesimals Form", description: "The first planetesimals, small bodies that would eventually accrete to form planets, began to form in the solar system." },
                { year: 2023, title: "Today's Significance", description: "International Strange Music Day - Encouraging people to listen to new and different types of music." }
            ]
        },
        8: { // September
            5: [
                { year: -4530000000, title: "Giant Planets Form", description: "The giant planets of our solar system (Jupiter, Saturn, Uranus, and Neptune) began to form, capturing large amounts of gas from the solar nebula." },
                { year: 2023, title: "Today's Significance", description: "International Day of Charity - Recognizing the role of charity in alleviating humanitarian crises and human suffering." }
            ],
            22: [
                { year: -4510000000, title: "Terrestrial Planets Form", description: "The terrestrial planets (Mercury, Venus, Earth, and Mars) began to form through the accretion of planetesimals." },
                { year: 2023, title: "Today's Significance", description: "World Car Free Day - Encouraging motorists to give up their cars for a day." }
            ]
        },
        9: { // October
            1: [
                { year: -4500000000, title: "Moon Formation", description: "A Mars-sized body collided with the early Earth, ejecting material that would eventually form the Moon." },
                { year: 2023, title: "Today's Significance", description: "International Day of Older Persons - Recognizing the contributions of older persons and examining issues that affect their lives." }
            ],
            16: [
                { year: -4480000000, title: "Late Heavy Bombardment Begins", description: "The Late Heavy Bombardment began, a period when a large number of asteroids and comets impacted the inner planets of the solar system." },
                { year: 2023, title: "Today's Significance", description: "World Food Day - Raising awareness of the issues behind poverty and hunger." }
            ]
        },
        10: { // November
            7: [
                { year: -4470000000, title: "Earth's First Atmosphere Forms", description: "Earth's first atmosphere formed, primarily composed of gases released from the planet's interior through volcanic activity." },
                { year: 2023, title: "Today's Significance", description: "International Day of Medical Physics - Raising awareness about the role of medical physicists in healthcare." }
            ],
            22: [
                { year: -4450000000, title: "Earth's Magnetic Field Forms", description: "Earth's magnetic field began to form as the planet's core differentiated, providing protection from solar radiation." },
                { year: 2023, title: "Today's Significance", description: "Start of Thanksgiving Week - Beginning of the holiday season in the United States." }
            ]
        },
        11: { // December
            10: [
                { year: -4400000000, title: "Earth's Oceans Form", description: "Earth's oceans began to form as water vapor in the atmosphere condensed and filled the planet's basins." },
                { year: 2023, title: "Today's Significance", description: "Human Rights Day - Commemorating the adoption of the Universal Declaration of Human Rights." }
            ],
            31: [
                { year: -4600000000, title: "End of Cosmic Era", description: "As the Earth and solar system stabilized, the cosmic era of our planet's history came to an end, transitioning into the geological era." },
                { year: 2023, title: "Today's Significance", description: "New Year's Eve - Celebrations and gatherings to mark the end of the year." }
            ]
        }
    };
    
    // Function to load events based on selected era
    function loadEventsForEra(era) {
        switch(era) {
            case 'present':
                historicalEvents = presentEraEvents;
                break;
            case 'ancient':
                historicalEvents = ancientEraEvents;
                break;
            case 'prehistoric':
                historicalEvents = prehistoricEraEvents;
                break;
            case 'geological':
                historicalEvents = geologicalEraEvents;
                break;
            case 'cosmic':
                historicalEvents = cosmicEraEvents;
                break;
            default:
                historicalEvents = presentEraEvents;
        }
    }
    
    // Initialize calendar
    function initCalendar() {
        // Add event listeners
        prevMonthBtn.addEventListener('click', showPreviousMonth);
        nextMonthBtn.addEventListener('click', showNextMonth);
        prevYearBtn.addEventListener('click', showPreviousYear);
        nextYearBtn.addEventListener('click', showNextYear);
        closeBtn.addEventListener('click', closeModal);
        
        // Year input event listener
        yearInput.addEventListener('change', function() {
            const newYear = parseInt(yearInput.value);
            if (!isNaN(newYear)) {
                currentYear = newYear;
                displayCalendar();
            }
        });
        
        // Era selector event listener
        eraSelector.addEventListener('change', function() {
            currentEra = eraSelector.value;
            updateYearRangeForEra(currentEra);
            loadEventsForEra(currentEra);
            displayCalendar();
        });
        
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                closeModal();
            }
        });
        
        // Create glow effects
        createGlowEffects();
        
        // Initialize with current era's events
        loadEventsForEra(currentEra);
        
        // Show current month
        displayCalendar();
    }
    
    // Update year input range based on selected era
    function updateYearRangeForEra(era) {
        switch(era) {
            case 'present':
                yearInput.min = 1900;
                yearInput.max = 2100;
                currentYear = new Date().getFullYear();
                break;
            case 'ancient':
                yearInput.min = -5000;
                yearInput.max = 1900;
                currentYear = 0; // Default to year 0
                break;
            case 'prehistoric':
                yearInput.min = -200000;
                yearInput.max = -5000;
                currentYear = -10000; // Default to 10,000 BCE
                break;
            case 'geological':
                yearInput.min = -4600000000;
                yearInput.max = -200000;
                currentYear = -65000000; // Default to dinosaur extinction
                break;
            case 'cosmic':
                yearInput.min = -13800000000;
                yearInput.max = -4600000000;
                currentYear = -13800000000; // Big Bang
                break;
        }
        yearInput.value = currentYear;
    }
    
    // Create glow effects
    function createGlowEffects() {
        const container = document.querySelector('.container');
        for (let i = 0; i < 3; i++) {
            const glowElement = document.createElement('div');
            glowElement.classList.add('glow-effect');
            glowElement.style.left = `${Math.random() * 100}%`;
            glowElement.style.top = `${Math.random() * 100}%`;
            glowElement.style.animationDelay = `${i * 0.5}s`;
            container.appendChild(glowElement);
        }
    }
    
    // Display calendar - renamed from showMonth to displayCalendar for consistency
    function displayCalendar() {
        // Clear previous days
        calendarDays.innerHTML = '';
        
        // Update month and year display with BCE/CE notation
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        let yearDisplay = currentYear;
        if (currentYear < 0) {
            yearDisplay = Math.abs(currentYear) + ' BCE';
        } else if (currentYear < 1000) {
            yearDisplay = currentYear + ' CE';
        }
        monthYear.textContent = `${monthNames[currentMonth]} ${yearDisplay}`;
        
        // Get first day of month and number of days in month
        // For years before 1900, we need to handle date creation differently
        let firstDay, daysInMonth, prevMonthDays;
        
        if (currentYear >= 1900 || currentYear <= -1900) {
            // For modern years or very ancient years, use a simple calculation
            firstDay = (currentYear >= 0) ? 
                new Date(currentYear, currentMonth, 1).getDay() : 
                new Date(1970, currentMonth, 1).getDay(); // Use 1970 as reference for BCE years
            
            daysInMonth = 32 - new Date(Math.abs(currentYear), currentMonth, 32).getDate();
            prevMonthDays = 32 - new Date(Math.abs(currentYear), currentMonth - 1, 32).getDate();
        } else {
            // For years between -1900 and 1900, we can use the JavaScript Date
            firstDay = new Date(Math.max(currentYear, 1), currentMonth, 1).getDay();
            daysInMonth = new Date(Math.max(currentYear, 1), currentMonth + 1, 0).getDate();
            prevMonthDays = new Date(Math.max(currentYear, 1), currentMonth, 0).getDate();
        }
        
        // Calculate total cells needed (previous month days + current month days + next month days)
        const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;
        
        // Add days to calendar
        for (let i = 0; i < totalCells; i++) {
            const dayElement = document.createElement('div');
            dayElement.classList.add('day');
            
            // Previous month days
            if (i < firstDay) {
                const prevMonthDay = prevMonthDays - firstDay + i + 1;
                dayElement.textContent = prevMonthDay;
                dayElement.classList.add('inactive');
                calendarDays.appendChild(dayElement);
                continue;
            }
            
            // Current month days
            if (i >= firstDay && i < firstDay + daysInMonth) {
                const day = i - firstDay + 1;
                const dayNumber = document.createElement('div');
                dayNumber.classList.add('day-number');
                dayNumber.textContent = day;
                dayElement.appendChild(dayNumber);
                
                // Check if day has events
                if (historicalEvents[currentMonth] && historicalEvents[currentMonth][day]) {
                    dayElement.classList.add('has-event');
                    dayElement.addEventListener('click', function() {
                        showEvents(currentMonth, day, currentYear);
                    });
                }
                
                // Check if day is today - only for present era and current year
                const today = new Date();
                if (currentEra === 'present' && day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()) {
                    dayElement.classList.add('today');
                }
                
                calendarDays.appendChild(dayElement);
                continue;
            }
            
            // Next month days
            const nextMonthDay = i - firstDay - daysInMonth + 1;
            dayElement.textContent = nextMonthDay;
            dayElement.classList.add('inactive');
            calendarDays.appendChild(dayElement);
        }
    }
    
    // Show previous month
    function showPreviousMonth() {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
            yearInput.value = currentYear;
        }
        displayCalendar();
    }
    
    // Show next month
    function showNextMonth() {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
            yearInput.value = currentYear;
        }
        displayCalendar();
    }
    
    // Show previous year
    function showPreviousYear() {
        currentYear--;
        yearInput.value = currentYear;
        displayCalendar();
    }
    
    // Show next year
    function showNextYear() {
        currentYear++;
        yearInput.value = currentYear;
        displayCalendar();
    }
    
    // Show events for a specific day
    function showEvents(month, day, year) {
        // Clear previous events
        eventList.innerHTML = '';
        
        // Set selected date with BCE/CE notation
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        let yearDisplay = year;
        if (year < 0) {
            yearDisplay = Math.abs(year) + ' BCE';
        } else if (year < 1000) {
            yearDisplay = year + ' CE';
        }
        selectedDateEl.textContent = `${monthNames[month]} ${day}, ${yearDisplay}`;
        
        // Get events for the day
        const events = historicalEvents[month][day];
        
        // Add events to list
        events.forEach(event => {
            const eventItem = document.createElement('div');
            eventItem.classList.add('event-item');
            
            const eventYear = document.createElement('div');
            eventYear.classList.add('event-year');
            
            // Format event year with BCE/CE notation
            let displayYear = event.year;
            if (event.year < 0) {
                displayYear = Math.abs(event.year) + ' BCE';
            } else if (event.year < 1000) {
                displayYear = event.year + ' CE';
            }
            eventYear.textContent = displayYear;
            eventItem.appendChild(eventYear);
            
            const eventTitle = document.createElement('div');
            eventTitle.classList.add('event-title');
            eventTitle.textContent = event.title;
            eventItem.appendChild(eventTitle);
            
            const eventDescription = document.createElement('div');
            eventDescription.classList.add('event-description');
            eventDescription.textContent = event.description;
            eventItem.appendChild(eventDescription);
            
            eventList.appendChild(eventItem);
        });
        
        // Show modal
        modal.style.display = 'block';
    }
    
    // Close modal
    function closeModal() {
        modal.style.display = 'none';
    }
    
    // Initialize calendar
    initCalendar();
    
    // Initialize sidebar tabs
    initTabs();
    
    // Initialize news section
    initNews();
    
    // Initialize festivals section
    initFestivals();
    
    // Initialize notes section
    initNotes();
    
    // Tab functionality
    function initTabs() {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons
                tabBtns.forEach(b => b.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Hide all tab panes
                tabPanes.forEach(pane => pane.classList.remove('active'));
                
                // Show the corresponding tab pane
                const tabId = this.getAttribute('data-tab');
                document.getElementById(tabId).classList.add('active');
            });
        });
    }
    
    // News functionality
    function initNews() {
        // Set today's date for the news
        const today = new Date();
        
        // Create country selector
        const countrySelector = document.createElement('select');
        countrySelector.id = 'news-country';
        countrySelector.innerHTML = `
            <option value="us">United States</option>
            <option value="gb">United Kingdom</option>
            <option value="in">India</option>
            <option value="au">Australia</option>
            <option value="ca">Canada</option>
            <option value="fr">France</option>
        `;
        
        // Add country selector to the news filter
        const newsFilter = document.querySelector('.news-filter');
        newsFilter.insertBefore(countrySelector, newsCategory);
        
        // Update news category options to match available categories
        newsCategory.innerHTML = `
            <option value="business">Business</option>
            <option value="entertainment">Entertainment</option>
            <option value="general">General</option>
            <option value="health">Health</option>
            <option value="science">Science</option>
            <option value="sports">Sports</option>
            <option value="technology">Technology</option>
        `;
        
        // Load news on page load
        fetchNews(currentNewsCategory);
        
        // Add event listener to country selector
        countrySelector.addEventListener('change', function() {
            currentCountry = this.value;
            fetchNews(currentNewsCategory);
            // Reset the auto-refresh timer when country changes
            resetNewsRefreshTimer();
        });
        
        // Add event listener to category selector
        newsCategory.addEventListener('change', function() {
            currentNewsCategory = this.value;
            fetchNews(currentNewsCategory);
            // Reset the auto-refresh timer when category changes
            resetNewsRefreshTimer();
        });
        
        // Add event listener to refresh button
        refreshNewsBtn.addEventListener('click', function() {
            fetchNews(currentNewsCategory);
            // Reset the auto-refresh timer when manually refreshed
            resetNewsRefreshTimer();
        });
        
        // Set up automatic refresh every 3 minutes
        resetNewsRefreshTimer();
    }
    
    // Set up automatic news refresh with improved UI feedback
    function resetNewsRefreshTimer() {
        // Clear any existing timer
        if (window.newsRefreshTimer) {
            clearInterval(window.newsRefreshTimer);
        }
        
        // Set new timer to refresh every 3 minutes (180000 ms)
        // This is more efficient and still provides timely updates
        window.newsRefreshTimer = setInterval(() => {
            console.log('Auto-refreshing news...');
            
            // Update the indicator to show refreshing state
            const indicator = document.querySelector('.news-update-indicator');
            if (indicator) {
                indicator.innerHTML = `
                    <i class="fas fa-sync-alt fa-spin"></i>
                    <span>Refreshing news...</span>
                `;
            }
            
            // Fetch fresh news with visual feedback
            fetchFromPrimaryApi(currentNewsCategory)
                .catch(error => {
                    console.log('Auto-refresh: Primary API failed, trying backup:', error);
                    return fetchFromBackupApi(currentNewsCategory);
                })
                .catch(error => {
                    console.log('Auto-refresh: Both APIs failed:', error);
                    // Don't display sample news on auto-refresh failure
                    // Just update timestamps to keep content fresh
                    updateNewsTimestamps();
                })
                .finally(() => {
                    // Reset the indicator
                    if (indicator) {
                        setTimeout(() => {
                            indicator.innerHTML = `
                                <i class="fas fa-sync-alt"></i>
                                <span>Real-time updates active</span>
                            `;
                        }, 1000);
                    }
                });
        }, 3 * 60 * 1000); // 3 minutes
    }
    
    // Update the relative timestamps on news items
    function updateNewsTimestamps() {
        const newsTimeElements = document.querySelectorAll('.news-time');
        newsTimeElements.forEach(element => {
            const timestamp = element.getAttribute('data-timestamp');
            if (timestamp) {
                const pubDate = new Date(timestamp);
                element.textContent = getRelativeTimeString(pubDate);
            }
        });
    }
    
    // Get relative time string (e.g., "2 minutes ago")
    function getRelativeTimeString(date) {
        const now = new Date();
        const diffMs = now - date;
        const diffSec = Math.round(diffMs / 1000);
        const diffMin = Math.round(diffSec / 60);
        const diffHour = Math.round(diffMin / 60);
        const diffDay = Math.round(diffHour / 24);
        
        if (diffSec < 60) {
            return 'just now';
        } else if (diffMin < 60) {
            return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
        } else if (diffHour < 24) {
            return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
        } else if (diffDay < 7) {
            return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
        } else {
            return date.toLocaleDateString();
        }
    }
    
    // Fetch news from API with improved real-time updates
    function fetchNews(category) {
        // Show loading spinner with animation
        newsContainer.innerHTML = `
            <div class="loading-spinner">
                <div class="spinner-animation"></div>
                <p>Fetching latest news...</p>
            </div>
        `;
        
        // Try to fetch real news from primary API (GNews)
        fetchFromPrimaryApi(category)
            .catch(error => {
                console.log('Primary API failed, trying backup API:', error);
                return fetchFromBackupApi(category);
            })
            .catch(error => {
                console.log('Both APIs failed, using sample news:', error);
                // If both APIs fail, display sample news
                displaySampleNews();
            });
    }
    
    // Fetch from primary API (SauravKanchan's NewsAPI)
    function fetchFromPrimaryApi(category) {
        return new Promise((resolve, reject) => {
            // Construct the URL for top headlines by category and country
            let apiUrl = `${newsApiUrl}/top-headlines/category/${category}/${currentCountry}.json`;
            
            // Set a timeout to prevent long-hanging requests
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
            
            fetch(apiUrl, { signal: controller.signal })
                .then(response => {
                    clearTimeout(timeoutId);
                    if (!response.ok) {
                        throw new Error('Primary API response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.articles && data.articles.length > 0) {
                        // Transform articles to our format
                        const transformedNews = data.articles.map(article => ({
                            title: article.title,
                            description: article.description,
                            url: article.url,
                            published: article.publishedAt,
                            author: article.source.name
                        }));
                        
                        // Display the news
                        displayNews(transformedNews);
                        resolve(transformedNews);
                    } else {
                        throw new Error('No articles found in primary API response');
                    }
                })
                .catch(error => {
                    console.error('Error fetching from primary API:', error);
                    reject(error);
                });
        });
    }
    
    // Fetch from backup API (SauravKanchan's NewsAPI - everything endpoint)
    function fetchFromBackupApi(category) {
        return new Promise((resolve, reject) => {
            // Randomly select a news source from our list
            const randomSourceIndex = Math.floor(Math.random() * sourcesList.length);
            const source = sourcesList[randomSourceIndex];
            
            // Construct the URL for the everything endpoint with the selected source
            let apiUrl = `${backupNewsApiUrl}/${source}.json`;
            
            // Set a timeout to prevent long-hanging requests
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
            
            fetch(apiUrl, { signal: controller.signal })
                .then(response => {
                    clearTimeout(timeoutId);
                    if (!response.ok) {
                        throw new Error('Backup API response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.articles && data.articles.length > 0) {
                        // Transform articles to our format
                        const transformedNews = data.articles.map(article => ({
                            title: article.title,
                            description: article.description,
                            url: article.url,
                            published: article.publishedAt,
                            author: article.source.name
                        }));
                        
                        // Display the news
                        displayNews(transformedNews);
                        resolve(transformedNews);
                    } else {
                        throw new Error('No articles found in backup API response');
                    }
                })
                .catch(error => {
                    reject(error);
                });
        });
    }
    
    // Display news in the container with enhanced UI
    function displayNews(articles) {
        if (!articles || articles.length === 0) {
            newsContainer.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>No news available at the moment.</p>
                    <button id="retry-news-btn" class="retry-btn">Try Again</button>
                </div>
            `;
            
            // Add event listener to retry button
            setTimeout(() => {
                const retryBtn = document.getElementById('retry-news-btn');
                if (retryBtn) {
                    retryBtn.addEventListener('click', () => fetchNews(currentNewsCategory));
                }
            }, 0);
            
            displaySampleNews();
            return;
        }
        
        newsContainer.innerHTML = '';
        
        // Create a real-time update indicator
        const updateIndicator = document.createElement('div');
        updateIndicator.classList.add('news-update-indicator');
        updateIndicator.innerHTML = `
            <i class="fas fa-sync-alt"></i>
            <span>Real-time updates active</span>
        `;
        newsContainer.appendChild(updateIndicator);
        
        // Create news items container
        const newsItemsContainer = document.createElement('div');
        newsItemsContainer.classList.add('news-items-container');
        newsContainer.appendChild(newsItemsContainer);
        
        articles.slice(0, 10).forEach((article, index) => {
            const newsItem = document.createElement('div');
            newsItem.classList.add('news-item');
            newsItem.classList.add('news-item-animated');
            
            // Add staggered animation delay
            newsItem.style.animationDelay = `${index * 0.1}s`;
            
            // Format the publication date
            const pubDate = article.published ? new Date(article.published) : new Date();
            const relativeTime = getRelativeTimeString(pubDate);
            
            // Create a more visually appealing news item
            newsItem.innerHTML = `
                <div class="news-content">
                    <div class="news-header">
                        <div class="news-source">
                            <i class="fas fa-newspaper"></i>
                            <span>${article.author || 'Unknown Source'}</span>
                        </div>
                        <div class="news-time" data-timestamp="${pubDate.toISOString()}">
                            <i class="far fa-clock"></i>
                            <span>${relativeTime}</span>
                        </div>
                    </div>
                    <div class="news-title">${article.title || 'No Title'}</div>
                    <div class="news-description">${article.description || 'No description available'}</div>
                    <div class="news-actions">
                        <button class="read-more-btn">Read More</button>
                        <button class="share-btn"><i class="fas fa-share-alt"></i></button>
                    </div>
                </div>
            `;
            
            // Add click event to open the news article
            if (article.url) {
                const readMoreBtn = newsItem.querySelector('.read-more-btn');
                if (readMoreBtn) {
                    readMoreBtn.addEventListener('click', function(e) {
                        e.stopPropagation();
                        window.open(article.url, '_blank');
                    });
                }
                
                // Make the whole item clickable
                newsItem.addEventListener('click', function() {
                    window.open(article.url, '_blank');
                });
            }
            
            // Add share functionality
            const shareBtn = newsItem.querySelector('.share-btn');
            if (shareBtn) {
                shareBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    if (navigator.share) {
                        navigator.share({
                            title: article.title,
                            text: article.description,
                            url: article.url
                        }).catch(console.error);
                    } else {
                        // Fallback for browsers that don't support Web Share API
                        alert('Share feature not supported in your browser.');
                    }
                });
            }
            
            newsItemsContainer.appendChild(newsItem);
        });
        
        // Set up auto-refresh for real-time updates
        setupNewsAutoRefresh();
    }
    
    // Display sample news when API fails
    function displaySampleNews() {
        // Get current date for context
        const today = new Date();
        const day = today.getDate();
        const month = today.getMonth();
        
        // Create sample news with today's importance
        const todayImportance = getDayImportance(month, day);
        
        const sampleNews = [
            {
                source: { name: 'Daily Significance' },
                title: `Today's Importance: ${todayImportance.title}`,
                description: todayImportance.description,
                publishedAt: new Date().toISOString(),
                url: '#'
            },
            {
                source: { name: 'Tech News' },
                title: 'New AI Breakthrough Promises More Efficient Computing',
                description: 'Researchers have developed a new algorithm that could make AI systems run up to 50% faster while using less energy.',
                publishedAt: new Date(today.getTime() - 25 * 60000).toISOString(), // 25 minutes ago
                url: '#'
            },
            {
                source: { name: 'India Today' },
                title: 'India Celebrates National Science Day with Nationwide Events',
                description: 'Schools and universities across India are hosting special programs to commemorate the discovery of the Raman Effect.',
                publishedAt: new Date(today.getTime() - 55 * 60000).toISOString(), // 55 minutes ago
                url: '#'
            },
            {
                source: { name: 'Sports Update' },
                title: 'Cricket: India Wins Series Against Australia',
                description: 'In a thrilling final match, India secured a victory by 3 wickets to win the series 2-1.',
                publishedAt: new Date(today.getTime() - 2 * 60 * 60000).toISOString(), // 2 hours ago
                url: '#'
            },
            {
                source: { name: 'Business Daily' },
                title: 'Stock Markets Reach New Heights as Tech Sector Booms',
                description: 'Major indices closed at record highs yesterday, driven by strong performance in technology stocks.',
                publishedAt: new Date(today.getTime() - 3 * 60 * 60000).toISOString(), // 3 hours ago
                url: '#'
            },
            {
                source: { name: 'Health News' },
                title: 'New Study Reveals Benefits of Mediterranean Diet',
                description: 'Research confirms that following a Mediterranean diet can reduce the risk of heart disease and improve longevity.',
                publishedAt: new Date(today.getTime() - 5 * 60 * 60000).toISOString(), // 5 hours ago
                url: '#'
            }
        ];
        
        displayNews(sampleNews);
    }
    
    // Get the importance of a specific day
    function getDayImportance(month, day) {
        // Comprehensive database of day significance
        const dayImportance = {
            0: { // January
                1: { title: "New Year's Day", description: "The first day of the year in the Gregorian calendar. A time for new beginnings, resolutions, and celebrations worldwide." },
                15: { title: "Martin Luther King Jr. Day", description: "Honors the civil rights leader's legacy and promotes equal rights for all Americans. A day for reflection on racial equality and human rights." },
                26: { title: "Republic Day (India)", description: "Commemorates the adoption of the Constitution of India in 1950. A day celebrating India's transition to a republic with military parades and cultural events." },
                27: { title: "International Holocaust Remembrance Day", description: "Commemorates the victims of the Holocaust. A day to remember the genocide of six million Jews and millions of others by Nazi Germany." }
            },
            1: { // February
                2: { title: "Groundhog Day", description: "Traditional North American holiday where the groundhog's behavior predicts the arrival of spring. A day that highlights folklore and weather prediction traditions." },
                14: { title: "Valentine's Day", description: "Celebration of love and affection. A day for expressing love through gifts, cards, and romantic gestures worldwide." },
                28: { title: "National Science Day (India)", description: "Commemorates the discovery of the Raman Effect by Indian physicist C.V. Raman. A day promoting science education and scientific thinking." }
            },
            2: { // March
                8: { title: "International Women's Day", description: "Celebrates women's achievements and promotes gender equality. A global day recognizing women's social, economic, cultural, and political accomplishments." },
                14: { title: "Pi Day", description: "Celebrates the mathematical constant π (3.14). A day for mathematics enthusiasts to celebrate the infinite number through activities and pie eating." },
                20: { title: "Spring Equinox", description: "The first day of spring in the Northern Hemisphere. A day marking equal daylight and darkness, symbolizing renewal and growth." },
                22: { title: "World Water Day", description: "Raises awareness about the importance of freshwater. A day focusing on sustainable management of water resources and access to clean water." }
            },
            3: { // April
                1: { title: "April Fools' Day", description: "A day for pranks and hoaxes. A tradition of practical jokes that has been observed for centuries across many cultures." },
                7: { title: "World Health Day", description: "Raises awareness about global health issues. A day promoting healthcare equity and highlighting specific health concerns each year." },
                22: { title: "Earth Day", description: "Promotes environmental protection. A global event demonstrating support for environmental conservation and sustainability." }
            },
            4: { // May
                1: { title: "International Workers' Day", description: "Celebrates workers' rights and labor movements. A day honoring the contributions of workers and the achievements of labor movements worldwide." },
                8: { title: "World Red Cross Day", description: "Honors the principles of the International Red Cross and Red Crescent Movement. A day recognizing humanitarian efforts worldwide." },
                31: { title: "World No Tobacco Day", description: "Encourages 24-hour abstinence from tobacco. A day raising awareness about the health risks of tobacco use and advocating for effective policies." }
            },
            5: { // June
                5: { title: "World Environment Day", description: "Encourages environmental awareness and action. A global platform for public outreach on pressing environmental issues." },
                21: { title: "International Yoga Day", description: "Promotes yoga practice worldwide. A day celebrating the physical, mental, and spiritual benefits of yoga." },
                21: { title: "Summer Solstice", description: "The longest day of the year in the Northern Hemisphere. A day marking the astronomical beginning of summer with various cultural celebrations." }
            },
            6: { // July
                1: { title: "Doctor's Day (India)", description: "Honors physicians and their contributions. A day recognizing the dedication and service of medical professionals." },
                26: { title: "Kargil Vijay Diwas (India)", description: "Commemorates India's victory in the Kargil War. A day honoring the sacrifices of soldiers and celebrating the nation's military success." }
            },
            7: { // August
                15: { title: "Independence Day (India)", description: "Commemorates India's independence from British rule in 1947. A national holiday celebrating freedom with flag hoisting, parades, and cultural programs." },
                19: { title: "World Humanitarian Day", description: "Honors humanitarian workers. A day recognizing those who risk their lives in humanitarian service and rallying support for people affected by crises." },
                29: { title: "National Sports Day (India)", description: "Birthday of hockey legend Major Dhyan Chand. A day promoting sports and physical fitness across India." }
            },
            8: { // September
                5: { title: "Teacher's Day (India)", description: "Honors teachers and their contributions. A day celebrating the role of teachers in shaping society and developing future generations." },
                8: { title: "International Literacy Day", description: "Raises awareness about literacy issues. A day highlighting the importance of literacy for individuals, communities, and societies." },
                21: { title: "International Day of Peace", description: "Promotes peace among nations. A day devoted to strengthening the ideals of peace through observing 24 hours of non-violence and cease-fire." },
                27: { title: "World Tourism Day", description: "Raises awareness about tourism's social, cultural, political, and economic value. A day promoting accessible tourism and sustainable travel." }
            },
            9: { // October
                2: { title: "Gandhi Jayanti (India)", description: "Birthday of Mahatma Gandhi. A day celebrating the life and philosophy of India's 'Father of the Nation' and promoting non-violence." },
                10: { title: "World Mental Health Day", description: "Raises awareness about mental health issues. A day promoting mental health education, awareness, and advocacy against social stigma." },
                31: { title: "Halloween", description: "A celebration observed in many countries. A day of activities like trick-or-treating, carving pumpkins, festive gatherings, and wearing costumes." }
            },
            10: { // November
                14: { title: "Children's Day (India)", description: "Birthday of Jawaharlal Nehru, India's first Prime Minister. A day celebrating children and raising awareness about their rights, care, and education." },
                21: { title: "World Television Day", description: "Recognizes the impact of television on decision-making. A day acknowledging television's role in presenting different issues that affect people." }
            },
            11: { // December
                1: { title: "World AIDS Day", description: "Raises awareness about HIV/AIDS. A day dedicated to raising awareness of the AIDS pandemic and mourning those who have died of the disease." },
                10: { title: "Human Rights Day", description: "Commemorates the adoption of the Universal Declaration of Human Rights. A day promoting the principles of the Declaration and human rights for all." },
                25: { title: "Christmas Day", description: "Celebrates the birth of Jesus Christ. A religious and cultural celebration observed by billions of people around the world." }
            }
        };
        
        // Get the importance for the specific day
        if (dayImportance[month] && dayImportance[month][day]) {
            return dayImportance[month][day];
        }
        
        // Default importance if no specific entry exists
        return {
            title: "Every Day is Special",
            description: "While today may not have a widely recognized observance, remember that each day offers new opportunities for growth, learning, and making a positive impact."
        };
    }
    
    // Festivals functionality
    function initFestivals() {
        // Set today's date for the festival date picker
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        festivalDate.value = formattedDate;
        
        // Load festivals for today
        fetchFestivals(today);
        
        // Add event listener to date selector
        festivalDate.addEventListener('change', function() {
            const selectedDate = new Date(this.value);
            fetchFestivals(selectedDate);
            
            // Update day importance header when date changes
            updateDayImportanceHeader(selectedDate);
        });
        
        // Display today's importance in the festivals section header
        updateDayImportanceHeader(today);
    }
    
    // Update the festivals header with the day's importance
    function updateDayImportanceHeader(date) {
        const month = date.getMonth();
        const day = date.getDate();
        const importance = getDayImportance(month, day);
        
        // Create or update the importance element
        let importanceEl = document.getElementById('day-importance');
        if (!importanceEl) {
            importanceEl = document.createElement('div');
            importanceEl.id = 'day-importance';
            importanceEl.className = 'day-importance';
            document.querySelector('.festivals-header').appendChild(importanceEl);
        }
        
        importanceEl.innerHTML = `<h4>${importance.title}</h4><p>${importance.description}</p>`;
    }
    
    // Fetch festivals and important days
    function fetchFestivals(date) {
        const month = date.getMonth();
        const day = date.getDate();
        
        // Clear previous content
        festivalsContainer.innerHTML = '<div class="loading-spinner">Loading events...</div>';
        
        // Simulate API call with setTimeout
        setTimeout(() => {
            displayFestivals(date);
        }, 500);
    }
    
    // Display festivals and important days
    function displayFestivals(date) {
        const month = date.getMonth();
        const day = date.getDate();
        
        // Get festivals from our database
        const festivals = getFestivalsForDate(month, day);
        
        if (festivals.length === 0) {
            festivalsContainer.innerHTML = '<div class="error-message">No special events found for this date.</div>';
            return;
        }
        
        festivalsContainer.innerHTML = '';
        
        festivals.forEach(festival => {
            const festivalItem = document.createElement('div');
            festivalItem.classList.add('festival-item');
            
            // Add class based on festival type
            if (festival.type) {
                festivalItem.classList.add(festival.type);
            }
            
            festivalItem.innerHTML = `
                <div class="festival-type">${festival.type || 'Event'}</div>
                <div class="festival-title">${festival.title}</div>
                <div class="festival-description">${festival.description}</div>
            `;
            
            festivalsContainer.appendChild(festivalItem);
        });
    }
    
    // Get festivals for a specific date
    function getFestivalsForDate(month, day) {
        // This is a sample database of festivals and important days
        // In a real application, this would come from an API or a more comprehensive database
        const festivalsDatabase = {
            0: { // January
                1: [
                    { type: 'festival', title: 'New Year\'s Day', description: 'The first day of the year in the Gregorian calendar.' },
                    { type: 'birthday', title: 'J.D. Salinger (1919)', description: 'American writer known for "The Catcher in the Rye".' }
                ],
                26: [
                    { type: 'festival', title: 'Republic Day (India)', description: 'Commemorates the adoption of the Constitution of India.' },
                    { type: 'birthday', title: 'Wayne Gretzky (1961)', description: 'Canadian ice hockey player, considered one of the greatest of all time.' }
                ]
            },
            1: { // February
                14: [
                    { type: 'festival', title: 'Valentine\'s Day', description: 'A day celebrating love and affection.' },
                    { type: 'death', title: 'James Cook (1779)', description: 'British explorer, navigator, and cartographer.' }
                ],
                28: [
                    { type: 'festival', title: 'National Science Day (India)', description: 'Commemorates the discovery of the Raman Effect by Indian physicist C.V. Raman.' }
                ]
            },
            2: { // March
                8: [
                    { type: 'festival', title: 'International Women\'s Day', description: 'A global day celebrating the social, economic, cultural, and political achievements of women.' }
                ],
                14: [
                    { type: 'festival', title: 'Pi Day', description: 'An annual celebration of the mathematical constant π (pi).' },
                    { type: 'birthday', title: 'Albert Einstein (1879)', description: 'Theoretical physicist who developed the theory of relativity.' }
                ]
            },
            3: { // April
                1: [
                    { type: 'festival', title: 'April Fools\' Day', description: 'A day for playing pranks and practical jokes.' }
                ],
                22: [
                    { type: 'festival', title: 'Earth Day', description: 'A day to demonstrate support for environmental protection.' }
                ]
            },
            4: { // May
                1: [
                    { type: 'festival', title: 'International Workers\' Day', description: 'A celebration of laborers and the working classes.' }
                ],
                8: [
                    { type: 'festival', title: 'World Red Cross Day', description: 'Celebrates the principles of the International Red Cross and Red Crescent Movement.' }
                ]
            },
            5: { // June
                5: [
                    { type: 'festival', title: 'World Environment Day', description: 'A day for encouraging awareness and action for the protection of the environment.' }
                ],
                21: [
                    { type: 'festival', title: 'International Yoga Day', description: 'Celebrates the practice of yoga and its benefits.' },
                    { type: 'festival', title: 'Summer Solstice', description: 'The longest day of the year in the Northern Hemisphere.' }
                ]
            },
            6: { // July
                1: [
                    { type: 'festival', title: 'Doctor\'s Day (India)', description: 'Honors the contributions of physicians to individual lives and communities.' }
                ],
                26: [
                    { type: 'festival', title: 'Kargil Vijay Diwas (India)', description: 'Commemorates India\'s victory in the Kargil War.' }
                ]
            },
            7: { // August
                15: [
                    { type: 'festival', title: 'Independence Day (India)', description: 'Commemorates India\'s independence from British rule.' }
                ],
                29: [
                    { type: 'festival', title: 'National Sports Day (India)', description: 'Birthday of hockey legend Major Dhyan Chand, celebrated as National Sports Day.' }
                ]
            },
            8: { // September
                5: [
                    { type: 'festival', title: 'Teacher\'s Day (India)', description: 'Honors teachers and their contributions to education and society.' }
                ],
                27: [
                    { type: 'festival', title: 'World Tourism Day', description: 'Raises awareness about the role of tourism and its social, cultural, political, and economic value.' }
                ]
            },
            9: { // October
                2: [
                    { type: 'festival', title: 'Gandhi Jayanti (India)', description: 'Celebrates the birth of Mahatma Gandhi, the "Father of the Nation" in India.' },
                    { type: 'birthday', title: 'Mahatma Gandhi (1869)', description: 'Indian lawyer, anti-colonial nationalist, and political ethicist who employed nonviolent resistance.' }
                ],
                31: [
                    { type: 'festival', title: 'Halloween', description: 'A celebration observed in many countries on the eve of the Western Christian feast of All Hallows\' Day.' }
                ]
            },
            10: { // November
                14: [
                    { type: 'festival', title: 'Children\'s Day (India)', description: 'Celebrates children and raises awareness about their rights and education.' },
                    { type: 'birthday', title: 'Jawaharlal Nehru (1889)', description: 'The first Prime Minister of India and a central figure in Indian politics before and after independence.' }
                ],
                26: [
                    { type: 'festival', title: 'Constitution Day (India)', description: 'Commemorates the adoption of the Constitution of India.' }
                ]
            },
            11: { // December
                1: [
                    { type: 'festival', title: 'World AIDS Day', description: 'Raises awareness about AIDS and HIV.' }
                ],
                25: [
                    { type: 'festival', title: 'Christmas', description: 'Celebrates the birth of Jesus Christ and is a cultural and religious celebration among billions of people around the world.' }
                ]
            }
        };
        
        // Return festivals for the given date, or an empty array if none exist
        return (festivalsDatabase[month] && festivalsDatabase[month][day]) ? festivalsDatabase[month][day] : [];
    }
    
    // Notes functionality
    function initNotes() {
        // Display notes on page load
        displayNotes();
        
        // Add event listener to add note button
        addNoteBtn.addEventListener('click', function() {
            // Set today's date as default
            document.getElementById('note-date').value = new Date().toISOString().split('T')[0];
            // Show the modal
            noteModal.style.display = 'block';
        });
        
        // Add event listener to close button
        closeNoteBtn.addEventListener('click', function() {
            noteModal.style.display = 'none';
        });
        
        // Add event listener to form submission
        noteForm.addEventListener('submit', function(e) {
            e.preventDefault();
            addNote();
        });
        
        // Add event listeners to filter buttons
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons
                filterBtns.forEach(b => b.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Set current filter
                currentFilter = this.getAttribute('data-filter');
                
                // Display filtered notes
                displayNotes();
            });
        });
        
        // Close modal when clicking outside
        window.addEventListener('click', function(event) {
            if (event.target === noteModal) {
                noteModal.style.display = 'none';
            }
        });
    }
    
    // Add a new note
    function addNote() {
        const title = document.getElementById('note-title').value;
        const date = document.getElementById('note-date').value;
        const time = document.getElementById('note-time').value || '';
        const priority = document.getElementById('note-priority').value;
        const description = document.getElementById('note-description').value || '';
        
        // Create a new note object
        const newNote = {
            id: Date.now(), // Use timestamp as unique ID
            title: title,
            date: date,
            time: time,
            priority: priority,
            description: description,
            finished: false,
            createdAt: new Date().toISOString()
        };
        
        // Add to notes array
        personalNotes.push(newNote);
        
        // Save to localStorage
        saveNotes();
        
        // Display updated notes
        displayNotes();
        
        // Close the modal
        noteModal.style.display = 'none';
        
        // Reset the form
        noteForm.reset();
    }
    
    // Save notes to localStorage
    function saveNotes() {
        localStorage.setItem('personalNotes', JSON.stringify(personalNotes));
    }
    
    // Display notes based on current filter
    function displayNotes() {
        // Clear previous content
        notesContainer.innerHTML = '';
        
        // Filter notes based on current filter
        let filteredNotes = [];
        const today = new Date().toISOString().split('T')[0];
        
        switch(currentFilter) {
            case 'upcoming':
                filteredNotes = personalNotes.filter(note => !note.finished && note.date >= today);
                break;
            case 'finished':
                filteredNotes = personalNotes.filter(note => note.finished);
                break;
            default: // 'all'
                filteredNotes = personalNotes;
        }
        
        // Sort notes by date and priority
        filteredNotes.sort((a, b) => {
            // First sort by date
            if (a.date !== b.date) {
                return a.date.localeCompare(b.date);
            }
            
            // If same date, sort by time if available
            if (a.time && b.time && a.time !== b.time) {
                return a.time.localeCompare(b.time);
            }
            
            // If same time or no time, sort by priority
            const priorityOrder = { 'high': 0, 'medium': 1, 'low': 2 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        });
        
        // Display notes
        if (filteredNotes.length === 0) {
            notesContainer.innerHTML = '<div class="empty-message">No events to display.</div>';
            return;
        }
        
        filteredNotes.forEach(note => {
            const noteItem = document.createElement('div');
            noteItem.classList.add('note-item', `priority-${note.priority}`);
            
            if (note.finished) {
                noteItem.classList.add('finished');
            }
            
            // Format date for display
            const noteDate = new Date(note.date);
            const formattedDate = noteDate.toLocaleDateString('en-US', { 
                weekday: 'short', 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            });
            
            // Add time if available
            let dateTimeStr = formattedDate;
            if (note.time) {
                dateTimeStr += ` at ${note.time}`;
            }
            
            noteItem.innerHTML = `
                <div class="note-date">${dateTimeStr}</div>
                <div class="note-title">${note.title}</div>
                ${note.description ? `<div class="note-description">${note.description}</div>` : ''}
                <div class="note-priority ${note.priority}">${note.priority.charAt(0).toUpperCase() + note.priority.slice(1)} Priority</div>
                <div class="note-actions">
                    ${!note.finished ? `<button class="note-action-btn complete" data-id="${note.id}"><i class="fas fa-check"></i></button>` : ''}
                    <button class="note-action-btn delete" data-id="${note.id}"><i class="fas fa-trash"></i></button>
                </div>
            `;
            
            notesContainer.appendChild(noteItem);
        });
        
        // Add event listeners to action buttons
        document.querySelectorAll('.note-action-btn.complete').forEach(btn => {
            btn.addEventListener('click', function() {
                const noteId = parseInt(this.getAttribute('data-id'));
                markNoteAsComplete(noteId);
            });
        });
        
        document.querySelectorAll('.note-action-btn.delete').forEach(btn => {
            btn.addEventListener('click', function() {
                const noteId = parseInt(this.getAttribute('data-id'));
                deleteNote(noteId);
            });
        });
    }
    
    // Mark a note as complete
    function markNoteAsComplete(noteId) {
        const noteIndex = personalNotes.findIndex(note => note.id === noteId);
        if (noteIndex !== -1) {
            personalNotes[noteIndex].finished = true;
            saveNotes();
            displayNotes();
        }
    }
    
    // Delete a note
    function deleteNote(noteId) {
        personalNotes = personalNotes.filter(note => note.id !== noteId);
        saveNotes();
        displayNotes();
    }
});