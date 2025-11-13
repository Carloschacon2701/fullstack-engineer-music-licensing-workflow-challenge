import { PrismaClient } from 'generated/prisma/client';

const prisma = new PrismaClient();

// Type aliases for better readability
type Status = Awaited<ReturnType<typeof prisma.status.create>>;
type Song = Awaited<ReturnType<typeof prisma.song.create>>;
type Movie = Awaited<ReturnType<typeof prisma.movie.create>>;
type Scene = Awaited<ReturnType<typeof prisma.scene.create>>;
type Track = Awaited<ReturnType<typeof prisma.track.create>>;
type License = Awaited<ReturnType<typeof prisma.license.create>>;

// Data arrays
const statuses = [
  { name: 'Pending' },
  { name: 'Approved' },
  { name: 'Rejected' },
  { name: 'Expired' },
];

const songs = [
  {
    title: 'Epic Adventure',
    artist: 'The Soundtrackers',
    genre: 'Orchestral',
  },
  {
    title: 'City Lights',
    artist: 'Urban Beats',
    genre: 'Electronic',
  },
  {
    title: 'Country Road',
    artist: 'Acoustic Dreams',
    genre: 'Country',
  },
  {
    title: 'Jazz Night',
    artist: 'Smooth Jazz Collective',
    genre: 'Jazz',
  },
  {
    title: 'Rock Anthem',
    artist: 'Thunder Band',
    genre: 'Rock',
  },
];

const movies = [
  {
    title: 'The Great Adventure',
    description: 'An epic journey through uncharted territories.',
  },
  {
    title: 'City Dreams',
    description: 'A story about life in the modern metropolis.',
  },
  {
    title: 'Rural Tales',
    description: 'Exploring the beauty of countryside life.',
  },
];

const scenes = [
  {
    movieIndex: 0, // The Great Adventure
    title: 'Opening Sequence',
    description: 'The movie begins with an epic landscape shot.',
  },
  {
    movieIndex: 0, // The Great Adventure
    title: 'Climactic Battle',
    description: 'The final confrontation between hero and villain.',
  },
  {
    movieIndex: 1, // City Dreams
    title: 'City Montage',
    description: 'A montage showing the bustling city life.',
  },
  {
    movieIndex: 1, // City Dreams
    title: 'Night Drive',
    description: 'A character driving through the city at night.',
  },
  {
    movieIndex: 2, // Rural Tales
    title: 'Sunrise on the Farm',
    description: 'A peaceful morning scene on a rural farm.',
  },
];

const tracks = [
  {
    sceneIndex: 0,
    songIndex: 0,
    start_time_seconds: 0,
    end_time_seconds: 120,
  },
  {
    sceneIndex: 1,
    songIndex: 0,
    start_time_seconds: 0,
    end_time_seconds: 180,
  },
  {
    sceneIndex: 2,
    songIndex: 1,
    start_time_seconds: 0,
    end_time_seconds: 90,
  },
  {
    sceneIndex: 3,
    songIndex: 1,
    start_time_seconds: 0,
    end_time_seconds: 150,
  },
  {
    sceneIndex: 4,
    songIndex: 2,
    start_time_seconds: 0,
    end_time_seconds: 100,
  },
  {
    sceneIndex: 0,
    songIndex: 3,
    start_time_seconds: 120,
    end_time_seconds: 240,
  },
  {
    sceneIndex: 1,
    songIndex: 4,
    start_time_seconds: 180,
    end_time_seconds: 300,
  },
];

const licenses = [
  {
    trackIndex: 0,
    statusName: 'Approved',
  },
  {
    trackIndex: 1,
    statusName: 'Pending',
  },
  {
    trackIndex: 2,
    statusName: 'Approved',
  },
  {
    trackIndex: 3,
    statusName: 'Rejected',
  },
  {
    trackIndex: 4,
    statusName: 'Approved',
  },
  {
    trackIndex: 5,
    statusName: 'Expired',
  },
  {
    trackIndex: 6,
    statusName: 'Pending',
  },
];

const licenseStatusHistories = [
  {
    trackIndex: 0,
    statusNames: ['Pending', 'Approved'],
  },
  {
    trackIndex: 1,
    statusNames: ['Pending'],
  },
  {
    trackIndex: 2,
    statusNames: ['Pending', 'Approved'],
  },
  {
    trackIndex: 3,
    statusNames: ['Pending', 'Rejected'],
  },
  {
    trackIndex: 4,
    statusNames: ['Pending', 'Approved'],
  },
  {
    trackIndex: 5,
    statusNames: ['Pending', 'Approved', 'Expired'],
  },
  {
    trackIndex: 6,
    statusNames: ['Pending'],
  },
];

// Seed functions
async function seedStatuses(): Promise<Status[]> {
  console.log('Creating statuses...');
  const createdStatuses = await Promise.all(
    statuses.map((status) => prisma.status.create({ data: status })),
  );
  console.log(`Created ${createdStatuses.length} status records`);
  return createdStatuses;
}

async function seedSongs(): Promise<Song[]> {
  console.log('Creating songs...');
  const createdSongs = await Promise.all(
    songs.map((song) => prisma.song.create({ data: song })),
  );
  console.log(`Created ${createdSongs.length} song records`);
  return createdSongs;
}

async function seedMovies(): Promise<Movie[]> {
  console.log('Creating movies...');
  const createdMovies = await Promise.all(
    movies.map((movie) => prisma.movie.create({ data: movie })),
  );
  console.log(`Created ${createdMovies.length} movie records`);
  return createdMovies;
}

async function seedScenes(createdMovies: Movie[]): Promise<Scene[]> {
  console.log('Creating scenes...');
  const createdScenes = await Promise.all(
    scenes.map((scene) =>
      prisma.scene.create({
        data: {
          movie_id: createdMovies[scene.movieIndex].id,
          title: scene.title,
          description: scene.description,
        },
      }),
    ),
  );
  console.log(`Created ${createdScenes.length} scene records`);
  return createdScenes;
}

async function seedTracks(
  createdScenes: Scene[],
  createdSongs: Song[],
): Promise<Track[]> {
  console.log('Creating tracks...');
  const createdTracks = await Promise.all(
    tracks.map((track) =>
      prisma.track.create({
        data: {
          scene_id: createdScenes[track.sceneIndex].id,
          song_id: createdSongs[track.songIndex].id,
          start_time_seconds: track.start_time_seconds,
          end_time_seconds: track.end_time_seconds,
        },
      }),
    ),
  );
  console.log(`Created ${createdTracks.length} track records`);
  return createdTracks;
}

async function seedLicenses(
  createdTracks: Track[],
  createdStatuses: Status[],
): Promise<License[]> {
  console.log('Creating licenses...');
  const statusMap = new Map(
    createdStatuses.map((status) => [status.name, status.id]),
  );
  const createdLicenses = await Promise.all(
    licenses.map((license) =>
      prisma.license.create({
        data: {
          track_id: createdTracks[license.trackIndex].id,
          status_id: statusMap.get(license.statusName)!,
        },
      }),
    ),
  );
  console.log(`Created ${createdLicenses.length} license records`);
  return createdLicenses;
}

async function seedLicenseStatusHistories(
  createdLicenses: License[],
  createdStatuses: Status[],
): Promise<void> {
  console.log('Creating license status history...');
  const statusMap = new Map(
    createdStatuses.map((status) => [status.name, status.id]),
  );
  const historyPromises: Promise<unknown>[] = [];

  licenseStatusHistories.forEach((history, index) => {
    history.statusNames.forEach((statusName) => {
      historyPromises.push(
        prisma.license_Status_History.create({
          data: {
            license_id: createdLicenses[index].id,
            status_id: statusMap.get(statusName)!,
          },
        }),
      );
    });
  });

  const createdHistories = await Promise.all(historyPromises);
  console.log(
    `Created ${createdHistories.length} license status history records`,
  );
}

async function clearDatabase() {
  console.log('Clearing existing data...');
  await prisma.license_Status_History.deleteMany();
  await prisma.license.deleteMany();
  await prisma.track.deleteMany();
  await prisma.scene.deleteMany();
  await prisma.movie.deleteMany();
  await prisma.song.deleteMany();
  await prisma.status.deleteMany();
}

async function main() {
  console.log('Seeding database...');

  await clearDatabase();

  const createdStatuses = await seedStatuses();
  const createdSongs = await seedSongs();
  const createdMovies = await seedMovies();
  const createdScenes = await seedScenes(createdMovies);
  const createdTracks = await seedTracks(createdScenes, createdSongs);
  const createdLicenses = await seedLicenses(createdTracks, createdStatuses);
  await seedLicenseStatusHistories(createdLicenses, createdStatuses);

  console.log('✅ Seeding completed successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
