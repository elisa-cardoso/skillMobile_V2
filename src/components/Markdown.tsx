import Markdown from 'react-native-markdown-display';
import { StyleSheet, View, Text } from 'react-native';

interface MarkdownRendererProps {
  content: string; 
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <View style={{ flex: 1 }}>
      <Markdown style={customStyles}>
        {content}
      </Markdown>
    </View>
  );
};

const customStyles = StyleSheet.create({
  text: {
    fontSize: 16,
    color: 'white',
  },
  heading2: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFD700',
    marginVertical: 8,
  },
  heading3: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFA500',
    marginVertical: 8,
  },
  paragraph: {
    fontSize: 16,
    color: '#36a49f',
    marginVertical: 4,
  },
  link: {
    color: '#36a49f',
    textDecorationLine: 'underline',
  },
  bulletList: {
    paddingLeft: 16,
    color: '#36a49f',
  },
  orderedList: {
    paddingLeft: 16,
    marginTop: 8,
  },
  listItem: {
    fontSize: 16,
    color: '#36a49f',
    marginVertical: 4,
  },
  codeBlock: {
    backgroundColor: '#333', 
    borderRadius: 4,
    padding: 8,
    marginVertical: 8,
    fontFamily: 'Courier'
  },
  blockquote: {
    backgroundColor: '#333',
    padding: 10,
    borderLeftWidth: 5,
    borderLeftColor: '#36a49f',
  },
  strong: {
    fontWeight: 'bold',
    color: '#FFD700',
  },
  em: {
    fontStyle: 'italic',
    color: '#36a49f',
  },
  orderedListItem: {
    marginVertical: 4,
    fontSize: 16,
    color: '#36a49f',
  },
});

