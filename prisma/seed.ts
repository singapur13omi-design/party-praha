import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding PARTY PRAHA database...");

  // 1. Country & City (Czech Republic -> Praha)
  const czechRepublic = await prisma.country.upsert({
    where: { code: "cz" },
    update: {},
    create: {
      code: "cz",
      name: "Czech Republic",
    },
  });

  const praha = await prisma.city.upsert({
    where: { slug: "praha" },
    update: {},
    create: {
      slug: "praha",
      name: "Praha",
      latitude: 50.0755,
      longitude: 14.4378,
      countryId: czechRepublic.id,
    },
  });

  // 2. Organizer User
  const hashedPassword = await bcrypt.hash("PartyPraha2026!", 10);
  const organizer = await prisma.user.upsert({
    where: { email: "organizer@partypraha.cz" },
    update: {},
    create: {
      email: "organizer@partypraha.cz",
      name: "Prague Nightlife Collective",
      passwordHash: hashedPassword,
      role: "ORGANIZER",
      ageVerified: true,
    },
  });

  // Today's date in YYYY-MM-DD
  const today = new Date().toISOString().split("T")[0];
  
  // Tomorrow's date
  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrow = tomorrowDate.toISOString().split("T")[0];

  // This weekend date (+2 days)
  const weekendDate = new Date();
  weekendDate.setDate(weekendDate.getDate() + 2);
  const thisWeekend = weekendDate.toISOString().split("T")[0];

  // 3. Real Prague Nightlife Seed Parties
  const partiesData = [
    {
      name: "ROXY MIDNIGHT SESSIONS // TECHNO & PEAK TIME",
      type: "CLUB",
      music: "Techno",
      description: "Legendárny pražský klub Roxy prináša temnú noc plnú nekompromisného berlínskeho techna s masívnym Funktion-One zvukovým aparátom a špičkovým laserovým mappingom. Svetoví headlineri a lokálna špička.",
      image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200&auto=format&fit=crop",
      location: "Roxy Prague, Dlouhá 33, Praha 1",
      latitude: 50.0906,
      longitude: 14.4264,
      date: today,
      startTime: "23:00",
      endTime: "06:00",
      is18Plus: true,
      status: "ACTIVE",
    },
    {
      name: "CROSS CLUB INDUSTRIAL BASS NIGHT",
      type: "RAVE",
      music: "DnB",
      description: "Ikonický steampunkový labyrint Cross Club v Holešoviciach. Dva stage nabité valivým Drum & Bassom, jungle a neurofunkom. Unikátne železné kinetické sochy, alternatívna atmosféra a energia až do rána.",
      image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop",
      location: "Cross Club, Plynární 1096/23, Praha 7",
      latitude: 50.1077,
      longitude: 14.4443,
      date: today,
      startTime: "21:00",
      endTime: "07:00",
      is18Plus: true,
      status: "ACTIVE",
    },
    {
      name: "DUPLEX ROOFTOP: SUNSET TO SUNRISE HOUSE",
      type: "VIP",
      music: "House",
      description: "Exkluzívna rooftop party priamo nad Václavským námestím. Melodický deep house a tech house, panoramatický výhľad na nočnú Prahu, prémiové koktaily a energická VIP atmosféra.",
      image: "https://images.unsplash.com/photo-1545128485-c400e7702796?q=80&w=1200&auto=format&fit=crop",
      location: "DupleX, Václavské nám. 21, Praha 1",
      latitude: 50.0826,
      longitude: 14.4259,
      date: today,
      startTime: "22:00",
      endTime: "05:00",
      is18Plus: true,
      status: "ACTIVE",
    },
    {
      name: "ANКALI INTELLECTUAL TECHNO ODYSSEY",
      type: "RAVE",
      music: "Techno",
      description: "Kultový undergroundový klenot vo Vršoviciach v bývalej továrni na mydlo. Raw industriálny sound, žiadne fotenie na parkete, čistá sloboda a hypnotické groovy bez zbytočného pozérstva.",
      image: "https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?q=80&w=1200&auto=format&fit=crop",
      location: "Ankali, Lopuchová 58/6, Praha 10",
      latitude: 50.0652,
      longitude: 14.4533,
      date: today,
      startTime: "23:59",
      endTime: "08:00",
      is18Plus: true,
      status: "ACTIVE",
    },
    {
      name: "KARLOVY LÁZNĚ 5-FLOOR NIGHT EXPLOSION",
      type: "CLUB",
      music: "EDM",
      description: "Najväčší klubový komplex v strednej Európe priamo pri Karlovom moste. 5 poschodí s rôznymi žánrami od EDM festivalového mainstage cez hip-hop až po retro klasiky.",
      image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=1200&auto=format&fit=crop",
      location: "Karlovy Lázně, Novotného lávka 198, Praha 1",
      latitude: 50.0854,
      longitude: 14.4137,
      date: today,
      startTime: "21:00",
      endTime: "05:00",
      is18Plus: false,
      status: "ACTIVE",
    },
    {
      name: "CHAPEAU ROUGE LATIN & URBAN BEATS",
      type: "CLUB",
      music: "Latin",
      description: "Trojposchodový bar a klub v srdci Starého Mesta. Spodné poschodie s horúcimi rytmami reggaetonu, afrobeatov a urban latino vibes. Plný parket, pulzujúci život a skvelé drinky.",
      image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop",
      location: "Chapeau Rouge, Jakubská 2, Praha 1",
      latitude: 50.0883,
      longitude: 14.4243,
      date: tomorrow,
      startTime: "22:00",
      endTime: "04:30",
      is18Plus: false,
      status: "ACTIVE",
    },
    {
      name: "FUCHS2 VINOHRADY ELECTRONIC RITUAL",
      type: "RAVE",
      music: "Techno",
      description: "Funkcionalistický ostrovný klub na Štvanici. Špičkový kurátorský výber súčasnej európskej elektroniky, avantgardné svetelné inštalácie a neopakovateľná komunita.",
      image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200&auto=format&fit=crop",
      location: "Fuchs2, Ostrov Štvanice 758, Praha 7",
      latitude: 50.0954,
      longitude: 14.4371,
      date: thisWeekend,
      startTime: "23:00",
      endTime: "07:00",
      is18Plus: true,
      status: "ACTIVE",
    },
    {
      name: "EPIC PRAGUE // BIG ROOM SATURDAY",
      type: "CLUB",
      music: "EDM",
      description: "Najmodernejší EDM klub v Česku s obrovskou LED stenou s rozlohou cez 100 m² a špičkovými L-Acoustics K2 reproduktormi. Noc pre fanúšikov veľkolepej festivalovej show.",
      image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=1200&auto=format&fit=crop",
      location: "Epic Prague, Revoluční 1003/3, Praha 1",
      latitude: 50.0909,
      longitude: 14.4283,
      date: thisWeekend,
      startTime: "22:00",
      endTime: "05:00",
      is18Plus: true,
      status: "ACTIVE",
    },
  ];

  for (const party of partiesData) {
    const existing = await prisma.party.findFirst({
      where: {
        name: party.name,
        cityId: praha.id,
      },
    });

    if (!existing) {
      await prisma.party.create({
        data: {
          ...party,
          cityId: praha.id,
          countryId: czechRepublic.id,
          organizerId: organizer.id,
        },
      });
      console.log(`✓ Created party: ${party.name}`);
    } else {
      console.log(`- Party already exists: ${party.name}`);
    }
  }

  console.log("Seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
