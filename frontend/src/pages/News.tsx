import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Newspaper,
  Clock,
  Eye,
  TrendingUp,
  Zap,
  ExternalLink,
  AlertCircle,
} from 'lucide-react';
import apiClient from '../api/client';
import Card from '../components/ui/Card';

interface NewsItem {
  _id: string;
  title: string;
  description: string;
  content: string;
  source: string;
  url: string;
  imageUrl?: string;
  category: string;
  tags: string[];
  publishedAt: string;
  isBreaking: boolean;
  views: number;
}

const categories = [
  { id: 'all', label: 'All News', icon: Newspaper },
  { id: 'bitcoin', label: 'Bitcoin', icon: TrendingUp },
  { id: 'ethereum', label: 'Ethereum', icon: TrendingUp },
  { id: 'altcoins', label: 'Altcoins', icon: TrendingUp },
  { id: 'defi', label: 'DeFi', icon: Zap },
  { id: 'nft', label: 'NFT', icon: Zap },
  { id: 'regulation', label: 'Regulation', icon: AlertCircle },
  { id: 'market', label: 'Market', icon: TrendingUp },
];

const News: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [breakingNews, setBreakingNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);

  useEffect(() => {
    fetchNews();
    fetchBreakingNews();
  }, [selectedCategory]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const params = selectedCategory !== 'all' ? { category: selectedCategory } : {};
      const { data } = await apiClient.get('/news', { params });
      setNews(data.data || []);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBreakingNews = async () => {
    try {
      const { data } = await apiClient.get('/news/breaking');
      setBreakingNews(data.data || []);
    } catch (error) {
      console.error('Error fetching breaking news:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      bitcoin: 'bg-orange-500',
      ethereum: 'bg-purple-500',
      altcoins: 'bg-blue-500',
      defi: 'bg-green-500',
      nft: 'bg-pink-500',
      regulation: 'bg-red-500',
      market: 'bg-yellow-500',
      general: 'bg-gray-500',
    };
    return colors[category] || colors.general;
  };

  if (loading && news.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 sm:py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <Newspaper className="w-10 h-10 sm:w-12 sm:h-12 text-primary-500" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Crypto News
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            Stay updated with the latest cryptocurrency news
          </p>
        </motion.div>

        {/* Breaking News Ticker */}
        {breakingNews.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6 overflow-hidden bg-red-500 text-white rounded-xl"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 px-4 py-3 bg-red-600 font-bold flex items-center gap-2">
                <Zap className="w-4 h-4 animate-pulse" />
                BREAKING
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="animate-marquee whitespace-nowrap py-3 px-4">
                  {breakingNews.map((item, index) => (
                    <span key={item._id} className="mx-8">
                      {item.title}
                      {index < breakingNews.length - 1 && ' • '}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 overflow-x-auto pb-2"
        >
          <div className="flex gap-2 min-w-max">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-primary-500 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <cat.icon className="w-4 h-4" />
                {cat.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (index % 6) }}
            >
              <Card
                className="h-full overflow-hidden hover:shadow-xl transition-all cursor-pointer group"
                onClick={() => setSelectedArticle(item)}
              >
                {/* Image */}
                {item.imageUrl && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {item.isBreaking && (
                      <div className="absolute top-2 left-2 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        BREAKING
                      </div>
                    )}
                    <div
                      className={`absolute top-2 right-2 px-2 py-1 ${getCategoryColor(
                        item.category
                      )} text-white text-xs font-medium rounded-full capitalize`}
                    >
                      {item.category}
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary-500 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                    {item.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {item.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Meta */}
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(item.publishedAt)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {item.views}
                      </span>
                    </div>
                    <span className="font-medium">{item.source}</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {news.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Newspaper className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-600 dark:text-gray-400 mb-2">
              No news found
            </h3>
            <p className="text-gray-500">Try selecting a different category</p>
          </motion.div>
        )}

        {/* Article Modal */}
        {selectedArticle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedArticle(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedArticle.imageUrl && (
                <img
                  src={selectedArticle.imageUrl}
                  alt={selectedArticle.title}
                  className="w-full h-64 object-cover"
                />
              )}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span
                    className={`px-3 py-1 ${getCategoryColor(
                      selectedArticle.category
                    )} text-white text-sm font-medium rounded-full capitalize`}
                  >
                    {selectedArticle.category}
                  </span>
                  {selectedArticle.isBreaking && (
                    <span className="px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-full flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      Breaking
                    </span>
                  )}
                </div>

                <h2 className="text-2xl font-bold mb-4">{selectedArticle.title}</h2>

                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {formatDate(selectedArticle.publishedAt)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {selectedArticle.views} views
                  </span>
                  <span className="font-medium">{selectedArticle.source}</span>
                </div>

                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                  {selectedArticle.content}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedArticle.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-sm rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedArticle(null)}
                    className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => window.open(selectedArticle.url, '_blank')}
                    className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Read Full Article
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* CSS for marquee animation */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default News;
