import { create } from 'zustand';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent' | 'system';
  timestamp: Date;
  status?: 'sent' | 'delivered' | 'read';
}

export interface Conversation {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  status: 'active' | 'waiting' | 'resolved';
  lastMessage: string;
  lastActivity: Date;
  unreadCount: number;
  messages: Message[];
  userEmail: string;
  userPhone?: string;
  tags?: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  status: 'online' | 'offline' | 'away' | 'busy';
  lastSeen: Date;
  conversationHistory: number;
  totalTickets: number;
  notes?: string;
}

interface ChatState {
  conversations: Conversation[];
  selectedConversationId: string | null;
  selectedUser: User | null;
  sidebarCollapsed: boolean;
  userPanelOpen: boolean;
  activeView: 'conversations' | 'settings';
  
  // Actions
  selectConversation: (conversationId: string) => void;
  sendMessage: (text: string) => void;
  markAsRead: (conversationId: string) => void;
  toggleSidebar: () => void;
  toggleUserPanel: () => void;
  setActiveView: (view: 'conversations' | 'settings') => void;
}

// Mock data
const mockConversations: Conversation[] = [
  {
    id: '1',
    userId: 'user1',
    userName: 'Sarah Johnson',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    status: 'active',
    lastMessage: 'I need help with my order',
    lastActivity: new Date(),
    unreadCount: 2,
    userEmail: 'sarah.johnson@email.com',
    userPhone: '+1 (555) 123-4567',
    tags: ['urgent', 'order-issue'],
    messages: [
      {
        id: 'm1',
        text: 'Hello, I have an issue with my recent order',
        sender: 'user',
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
        status: 'read'
      },
      {
        id: 'm2',
        text: 'Hi Sarah! I\'d be happy to help. Can you provide your order number?',
        sender: 'agent',
        timestamp: new Date(Date.now() - 8 * 60 * 1000),
        status: 'read'
      },
      {
        id: 'm3',
        text: 'Yes, it\'s #12345. The delivery was supposed to be today but I haven\'t received anything',
        sender: 'user',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        status: 'delivered'
      },
      {
        id: 'm4',
        text: 'I need help with my order',
        sender: 'user',
        timestamp: new Date(Date.now() - 1 * 60 * 1000),
        status: 'sent'
      }
    ]
  },
  {
    id: '2',
    userId: 'user2',
    userName: 'Mike Chen',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
    status: 'waiting',
    lastMessage: 'Thanks for the quick response!',
    lastActivity: new Date(Date.now() - 30 * 60 * 1000),
    unreadCount: 0,
    userEmail: 'mike.chen@email.com',
    tags: ['billing'],
    messages: [
      {
        id: 'm5',
        text: 'I have a question about my billing cycle',
        sender: 'user',
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        status: 'read'
      },
      {
        id: 'm6',
        text: 'Your billing cycle starts on the 15th of each month',
        sender: 'agent',
        timestamp: new Date(Date.now() - 35 * 60 * 1000),
        status: 'read'
      },
      {
        id: 'm7',
        text: 'Thanks for the quick response!',
        sender: 'user',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        status: 'read'
      }
    ]
  },
  {
    id: '3',
    userId: 'user3',
    userName: 'Emily Davis',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    status: 'active',
    lastMessage: 'Can you help me reset my password?',
    lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000),
    unreadCount: 1,
    userEmail: 'emily.davis@email.com',
    tags: ['account'],
    messages: [
      {
        id: 'm8',
        text: 'Can you help me reset my password?',
        sender: 'user',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        status: 'sent'
      }
    ]
  }
];

const mockUsers: Record<string, User> = {
  'user1': {
    id: 'user1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 123-4567',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    status: 'online',
    lastSeen: new Date(),
    conversationHistory: 12,
    totalTickets: 8,
    notes: 'Premium customer since 2022. Prefers email communication.'
  },
  'user2': {
    id: 'user2',
    name: 'Mike Chen',
    email: 'mike.chen@email.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
    status: 'away',
    lastSeen: new Date(Date.now() - 30 * 60 * 1000),
    conversationHistory: 5,
    totalTickets: 3,
    notes: 'Tech-savvy user. Often provides detailed bug reports.'
  },
  'user3': {
    id: 'user3',
    name: 'Emily Davis',
    email: 'emily.davis@email.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    status: 'offline',
    lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000),
    conversationHistory: 3,
    totalTickets: 2,
    notes: 'New customer. May need extra guidance.'
  }
};

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: mockConversations,
  selectedConversationId: null,
  selectedUser: null,
  sidebarCollapsed: false,
  userPanelOpen: true,
  activeView: 'settings',

  selectConversation: (conversationId: string) => {
    const conversation = get().conversations.find(c => c.id === conversationId);
    const user = conversation ? mockUsers[conversation.userId] : null;
    
    set({
      selectedConversationId: conversationId,
      selectedUser: user
    });

    // Mark conversation as read
    get().markAsRead(conversationId);
  },

  sendMessage: (text: string) => {
    const { selectedConversationId, conversations } = get();
    if (!selectedConversationId) return;

    const newMessage: Message = {
      id: `m${Date.now()}`,
      text,
      sender: 'agent',
      timestamp: new Date(),
      status: 'sent'
    };

    const updatedConversations = conversations.map(conv => {
      if (conv.id === selectedConversationId) {
        return {
          ...conv,
          messages: [...conv.messages, newMessage],
          lastMessage: text,
          lastActivity: new Date()
        };
      }
      return conv;
    });

    set({ conversations: updatedConversations });
  },

  markAsRead: (conversationId: string) => {
    const { conversations } = get();
    const updatedConversations = conversations.map(conv => {
      if (conv.id === conversationId) {
        return { ...conv, unreadCount: 0 };
      }
      return conv;
    });

    set({ conversations: updatedConversations });
  },

  toggleSidebar: () => {
    set(state => ({ sidebarCollapsed: !state.sidebarCollapsed }));
  },

  toggleUserPanel: () => {
    set(state => ({ userPanelOpen: !state.userPanelOpen }));
  },

  setActiveView: (view: 'conversations' | 'settings') => {
    set({ activeView: view });
  }
}));