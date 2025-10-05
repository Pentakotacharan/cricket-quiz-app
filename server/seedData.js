const mongoose = require('mongoose')
const dotenv = require('dotenv')
const Quiz = require('./models/Quiz')
const Player = require('./models/Player')
const Badge = require('./models/Badge')
const connectDB = require('./config/db')

// Load environment variables
dotenv.config()

// Sample quiz data
const sampleQuizzes = [
  {
    title: "Cricket Batting Fundamentals",
    description: "Test your knowledge of cricket batting techniques and rules",
    category: "Batting",
    difficulty: "Easy",
    timeLimit: 10,
    questions: [
      {
        question: "What is the maximum number of runs a batsman can score off a single ball without any extras?",
        options: ["4", "5", "6", "8"],
        correctAnswer: "6",
        explanation: "A batsman can score a maximum of 6 runs off a single ball by hitting a six.",
        points: 10
      },
      {
        question: "Which shot is played to a ball pitched on the leg side?",
        options: ["Cover drive", "Leg glance", "Cut shot", "Pull shot"],
        correctAnswer: "Leg glance",
        explanation: "A leg glance is played to balls on the leg side, deflecting them behind square.",
        points: 10
      },
      {
        question: "What does LBW stand for in cricket?",
        options: ["Leg Before Wicket", "Left Behind Wicket", "Late Bowling Warning", "Line Ball Wide"],
        correctAnswer: "Leg Before Wicket",
        explanation: "LBW stands for Leg Before Wicket, a method of dismissal.",
        points: 10
      },
      {
        question: "How many ways can a batsman get out in cricket?",
        options: ["8", "10", "11", "12"],
        correctAnswer: "10",
        explanation: "There are 10 ways to get out: bowled, caught, LBW, run out, stumped, hit wicket, handled ball, obstructing field, hit ball twice, and timed out.",
        points: 15
      },
      {
        question: "What is a 'duck' in cricket?",
        options: ["A type of shot", "Getting out for zero runs", "A fielding position", "A bowling style"],
        correctAnswer: "Getting out for zero runs",
        explanation: "A 'duck' refers to a batsman getting out without scoring any runs.",
        points: 10
      }
    ]
  },
  {
    title: "Cricket Bowling Mastery",
    description: "Challenge yourself with questions about cricket bowling techniques and strategies",
    category: "Bowling",
    difficulty: "Medium",
    timeLimit: 15,
    questions: [
      {
        question: "What is a 'yorker' in cricket bowling?",
        options: ["A ball that bounces twice", "A ball pitched at the batsman's feet", "A ball that doesn't bounce", "A ball bowled over arm"],
        correctAnswer: "A ball pitched at the batsman's feet",
        explanation: "A yorker is a ball pitched right at the batsman's feet, making it very difficult to score runs.",
        points: 15
      },
      {
        question: "How many balls are bowled in one over in cricket?",
        options: ["4", "5", "6", "8"],
        correctAnswer: "6",
        explanation: "An over consists of 6 balls bowled consecutively by the same bowler from one end.",
        points: 10
      },
      {
        question: "What is the maximum number of bouncers allowed per over in ODI cricket?",
        options: ["1", "2", "3", "No limit"],
        correctAnswer: "2",
        explanation: "In ODI cricket, a maximum of 2 bouncers per over are allowed.",
        points: 15
      },
      {
        question: "Which type of bowling involves making the ball swing in the air?",
        options: ["Spin bowling", "Fast bowling", "Medium pace", "Swing bowling"],
        correctAnswer: "Swing bowling",
        explanation: "Swing bowling involves making the ball move or 'swing' through the air due to seam position and atmospheric conditions.",
        points: 15
      },
      {
        question: "What is a 'maiden over'?",
        options: ["An over with 6 wickets", "An over with no runs scored", "The first over of an innings", "An over bowled by a debutant"],
        correctAnswer: "An over with no runs scored",
        explanation: "A maiden over is one in which no runs are scored off the bat.",
        points: 10
      }
    ]
  },
  {
    title: "Cricket History & Legends",
    description: "Explore the rich history of cricket and its legendary players",
    category: "History",
    difficulty: "Hard",
    timeLimit: 20,
    questions: [
      {
        question: "Who scored the first double century in ODI cricket?",
        options: ["Sachin Tendulkar", "Rohit Sharma", "Virender Sehwag", "Martin Guptill"],
        correctAnswer: "Sachin Tendulkar",
        explanation: "Sachin Tendulkar scored the first double century (200*) in ODI cricket against South Africa in 2010.",
        points: 20
      },
      {
        question: "Which country won the first Cricket World Cup in 1975?",
        options: ["Australia", "West Indies", "England", "India"],
        correctAnswer: "West Indies",
        explanation: "The West Indies won the first Cricket World Cup held in England in 1975.",
        points: 15
      },
      {
        question: "Who holds the record for most runs in Test cricket?",
        options: ["Sachin Tendulkar", "Ricky Ponting", "Jacques Kallis", "Rahul Dravid"],
        correctAnswer: "Sachin Tendulkar",
        explanation: "Sachin Tendulkar holds the record for most runs in Test cricket with 15,921 runs.",
        points: 15
      },
      {
        question: "In which year was the first Test match played?",
        options: ["1877", "1882", "1890", "1900"],
        correctAnswer: "1877",
        explanation: "The first Test match was played between Australia and England at Melbourne in 1877.",
        points: 25
      },
      {
        question: "Who was known as 'The Don' in cricket?",
        options: ["Don Bradman", "Don Tallon", "Allan Donald", "Don Wilson"],
        correctAnswer: "Don Bradman",
        explanation: "Sir Don Bradman was known as 'The Don' and is considered the greatest batsman of all time.",
        points: 15
      }
    ]
  }
]

// Sample player data
const samplePlayers = [
  {
    name: "Virat Kohli",
    team: "Royal Challengers Bangalore",
    country: "India",
    role: "Batsman",
    dateOfBirth: new Date("1988-11-05"),
    placeOfBirth: "Delhi, India",
    stats: {
      matches: 500,
      runs: 24000,
      wickets: 4,
      average: 53.5,
      strikeRate: 93.2,
      centuries: 70,
      halfCenturies: 130
    },
    career_highlights: [
      "ICC ODI Player of the Decade (2011-2020)",
      "Fastest to 8000, 9000, 10000, 11000, 12000 ODI runs",
      "Most runs as captain in Test cricket",
      "Only player to average 50+ in all three formats"
    ],
    isActive: true,
    debutYear: 2008,
    battingStyle: "Right-handed",
    formats: ["Test", "ODI", "T20I", "IPL"]
  },
  {
    name: "MS Dhoni",
    team: "Chennai Super Kings",
    country: "India",
    role: "Wicket-keeper",
    dateOfBirth: new Date("1981-07-07"),
    placeOfBirth: "Ranchi, India",
    stats: {
      matches: 538,
      runs: 17266,
      wickets: 0,
      average: 50.6,
      strikeRate: 87.6,
      centuries: 16,
      halfCenturies: 108
    },
    career_highlights: [
      "World Cup winning captain (2011)",
      "Only captain to win all three ICC trophies",
      "Most international matches as captain",
      "Most dismissals by an Indian wicket-keeper"
    ],
    isActive: false,
    debutYear: 2004,
    retirementYear: 2020,
    battingStyle: "Right-handed",
    formats: ["Test", "ODI", "T20I", "IPL"]
  },
  {
    name: "Jasprit Bumrah",
    team: "Mumbai Indians",
    country: "India",
    role: "Bowler",
    dateOfBirth: new Date("1993-12-06"),
    placeOfBirth: "Ahmedabad, India",
    stats: {
      matches: 150,
      runs: 450,
      wickets: 280,
      average: 22.8,
      strikeRate: 30.2,
      economy: 4.5
    },
    career_highlights: [
      "Fastest Indian to 100 ODI wickets",
      "Best bowling figures in Test debut series in SA, Eng, Aus",
      "ICC Men's ODI Player of the Year 2023",
      "First Asian bowler to take 5+ wickets in an innings in SA, Eng, Aus"
    ],
    isActive: true,
    debutYear: 2016,
    battingStyle: "Right-handed",
    bowlingStyle: "Right-arm fast",
    formats: ["Test", "ODI", "T20I", "IPL"]
  }
]

// Sample badge data
const sampleBadges = [
  {
    name: "First Steps",
    description: "Complete your first quiz",
    criteria: {
      type: "quiz_count",
      value: 1
    },
    icon: "🏏",
    rarity: "Bronze",
    points: 10
  },
  {
    name: "Quiz Master",
    description: "Complete 10 quizzes",
    criteria: {
      type: "quiz_count",
      value: 10
    },
    icon: "📚",
    rarity: "Silver",
    points: 50
  },
  {
    name: "Century Maker",
    description: "Score 100 points in a single quiz",
    criteria: {
      type: "quiz_score",
      value: 100
    },
    icon: "💯",
    rarity: "Gold",
    points: 100
  },
  {
    name: "Perfect Game",
    description: "Score 100% in a quiz",
    criteria: {
      type: "perfect_score",
      value: 1
    },
    icon: "⭐",
    rarity: "Gold",
    points: 150
  },
  {
    name: "Streak Champion",
    description: "Maintain a 7-day streak",
    criteria: {
      type: "streak",
      value: 7
    },
    icon: "🔥",
    rarity: "Silver",
    points: 75
  },
  {
    name: "Point Collector",
    description: "Accumulate 1000 total points",
    criteria: {
      type: "total_points",
      value: 1000
    },
    icon: "💎",
    rarity: "Platinum",
    points: 200
  }
]

// Seed function
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...')

    // Connect to database
    await connectDB()

    // Clear existing data
    console.log('🗑️  Clearing existing data...')
    await Quiz.deleteMany({})
    await Player.deleteMany({})
    await Badge.deleteMany({})

    // Insert sample data
    console.log('📝 Inserting sample quizzes...')
    const createdQuizzes = await Quiz.insertMany(sampleQuizzes)
    console.log(`✅ Created ${createdQuizzes.length} quizzes`)

    console.log('👥 Inserting sample players...')
    const createdPlayers = await Player.insertMany(samplePlayers)
    console.log(`✅ Created ${createdPlayers.length} players`)

    console.log('🏆 Inserting sample badges...')
    const createdBadges = await Badge.insertMany(sampleBadges)
    console.log(`✅ Created ${createdBadges.length} badges`)

    console.log('🎉 Database seeding completed successfully!')
    console.log('\n📊 Summary:')
    console.log(`   - Quizzes: ${createdQuizzes.length}`)
    console.log(`   - Players: ${createdPlayers.length}`)
    console.log(`   - Badges: ${createdBadges.length}`)
    
    console.log('\n🚀 You can now start the server and begin using the app!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  }
}

// Run seeding
if (require.main === module) {
  seedDatabase()
}

module.exports = { seedDatabase, sampleQuizzes, samplePlayers, sampleBadges }