import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-cricket-primary rounded-full flex items-center justify-center">
                <span className="text-xl font-bold">🏏</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">Cricket Quiz & Learning</h3>
                <p className="text-gray-400 text-sm">Master the game, one question at a time</p>
              </div>
            </div>
            <p className="text-gray-400 mb-4">
              Test your cricket knowledge, learn about legendary players, and compete with 
              friends in the ultimate cricket quiz experience. From batting techniques to 
              historic matches, expand your understanding of the beautiful game.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-cricket-primary transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-cricket-primary transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-cricket-primary transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.004 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.281C3.85 14.977 3.365 13.768 3.365 12.427s.486-2.551 1.325-3.281c.839-.73 1.97-1.095 3.267-1.095 1.297 0 2.448.365 3.323 1.095.875.73 1.361 1.939 1.361 3.281s-.486 2.551-1.325 3.281c-.839.73-1.97 1.095-3.267 1.095zm7.138 0c-1.297 0-2.448-.49-3.323-1.281-.875-.791-1.361-2-1.361-3.341s.486-2.551 1.325-3.281c.839-.73 1.97-1.095 3.267-1.095 1.297 0 2.448.365 3.323 1.095.875.73 1.361 1.939 1.361 3.281s-.486 2.551-1.325 3.281c-.839.73-1.97 1.095-3.267 1.095z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/" className="hover:text-cricket-primary transition-colors">Home</a></li>
              <li><a href="/players" className="hover:text-cricket-primary transition-colors">Players Database</a></li>
              <li><a href="/leaderboard" className="hover:text-cricket-primary transition-colors">Leaderboard</a></li>
              <li><a href="/profile" className="hover:text-cricket-primary transition-colors">My Profile</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quiz Categories</h3>
            <ul className="space-y-2 text-gray-400">
              <li><span className="hover:text-cricket-primary transition-colors cursor-pointer">🏏 Batting</span></li>
              <li><span className="hover:text-cricket-primary transition-colors cursor-pointer">⚾ Bowling</span></li>
              <li><span className="hover:text-cricket-primary transition-colors cursor-pointer">📚 Cricket History</span></li>
              <li><span className="hover:text-cricket-primary transition-colors cursor-pointer">👥 Teams & Players</span></li>
              <li><span className="hover:text-cricket-primary transition-colors cursor-pointer">📊 Records & Stats</span></li>
            </ul>
          </div>
        </div>

        {/* Stats Section */}
        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-cricket-primary">500+</div>
              <div className="text-gray-400 text-sm">Quiz Questions</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-cricket-secondary">100+</div>
              <div className="text-gray-400 text-sm">Player Profiles</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-cricket-accent">50+</div>
              <div className="text-gray-400 text-sm">Achievements</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-500">1000+</div>
              <div className="text-gray-400 text-sm">Active Users</div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 Cricket Quiz & Learning. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-cricket-primary text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-cricket-primary text-sm transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-cricket-primary text-sm transition-colors">Contact Us</a>
              <a href="#" className="text-gray-400 hover:text-cricket-primary text-sm transition-colors">FAQ</a>
            </div>
          </div>

          {/* Made with love */}
          <div className="text-center mt-6">
            <p className="text-gray-500 text-sm">
              Made with ❤️ for cricket enthusiasts worldwide | 
              <span className="text-cricket-primary"> Powered by MERN Stack</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer