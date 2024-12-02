import { CategoryFilter } from "@components/CategoryFilter";
import { HomeHeader } from "@components/HomeHeader";
import { Center, Heading, Text, VStack, HStack } from "@gluestack-ui/themed";
import { useState, useEffect } from "react";
import { FlatList } from "react-native";
import { PostCard } from "@components/PostCard";
import { getCategories } from "@services/CategoryServices";
import { getSkillsByTitleAndCategory } from "@services/SkillServices";
import { Skills } from "../@types/skills";

export function Home() {
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [filteredSkills, setFilteredSkills] = useState<Skills[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTitle, setSearchTitle] = useState<string>(""); 
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;
  const [sortDirection, setSortDirection] = useState("ASC");

  useEffect(() => {
    getCategories()
      .then((data) => setCategories(data || []))
      .catch(() => setCategories([]));
  }, []);

  const fetchSkills = async (categoryId: number | null, title: string, page: number, size: number, sortDirection: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSkillsByTitleAndCategory(categoryId, title, page, size, sortDirection);
      setFilteredSkills(data.skills || []);
      setTotalPages(data.totalPages || 0);
    } catch (err) {
      setError("Erro ao carregar conhecimentos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills(selectedCategory, searchTitle, currentPage, perPage, sortDirection);
  }, [selectedCategory, searchTitle, currentPage, perPage, sortDirection]);

  const handleCategorySelect = (categoryId: number) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(categoryId);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  const handleSortChange = (sortDirection: string) => {
    setSortDirection(sortDirection);
    setCurrentPage(1);
  };

  const handleSearchTitleChange = (title: string) => {
    setSearchTitle(title);
  };

  return (
    <VStack flex={1}>
      <HomeHeader />
      <Center>
        <Heading color="$gray100" mt="$8">
          Explore nossa biblioteca
        </Heading>
      </Center>

      <FlatList
        data={categories}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <CategoryFilter
            name={item.name}
            isActive={selectedCategory === item.id}
            onPress={() => handleCategorySelect(item.id)}
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20 }}
        style={{ marginVertical: 25, maxHeight: 44, minHeight: 44 }}
      />

      {error && <Text>{error}</Text>}

      <PostCard
        skills={filteredSkills}
        currentPage={currentPage}
        totalPages={totalPages}
        onPrevPage={handlePrevPage}
        onNextPage={handleNextPage}
        onSortChange={handleSortChange}
        onSearchTitleChange={handleSearchTitleChange}
      />
    </VStack>
  );
}
