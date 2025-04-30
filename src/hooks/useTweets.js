import { useState, useCallback } from 'react';
import { api } from '@/utils/api';

export const useTweets = () => {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchTweets = useCallback(async (reset = false) => {
    if (reset) {
      setPage(1);
      setTweets([]);
    }

    try {
      setLoading(true);
      const response = await api.tweets.getAll({ page, limit: 20 });
      
      setTweets(prev => reset ? response.tweets : [...prev, ...response.tweets]);
      setHasMore(response.tweets.length === 20);
      setPage(prev => prev + 1);
    } catch (error) {
      console.error('Tweet yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  }, [page]);

  const addTweet = useCallback((newTweet) => {
    setTweets(prev => [newTweet, ...prev]);
  }, []);

  const updateTweet = useCallback((tweetId, updateFn) => {
    setTweets(prev => prev.map(tweet => 
      tweet._id === tweetId ? updateFn(tweet) : tweet
    ));
  }, []);

  const removeTweet = useCallback((tweetId) => {
    setTweets(prev => prev.filter(tweet => tweet._id !== tweetId));
  }, []);

  return { 
    tweets, 
    loading, 
    hasMore, 
    fetchTweets,
    addTweet,
    updateTweet,
    removeTweet
  };
}; 