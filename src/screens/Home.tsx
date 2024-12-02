import { CategoryFilter } from "@components/CategoryFilter";
import { HomeHeader } from "@components/HomeHeader";
import { Center, Heading, Text, VStack } from "@gluestack-ui/themed";
import { useState, useEffect, useCallback } from "react";
import { FlatList } from "react-native";
import { PostCard } from "@components/PostCard";
import { getCategories } from "@services/CategoryServices";
import { getSkillsByTitleAndCategory } from "@services/SkillServices";
import { Skills } from "../@types/skills";
import { debounce } from "lodash";

export function Home() {
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [filteredSkills, setFilteredSkills] = useState<Skills[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTitle, setSearchTitle] = useState<string>("");
  const [pageIndex, setPageIndex] = useState(1);
  const perPage = 10;

  useEffect(() => {
    getCategories()
      .then((data) => setCategories(data || []))
      .catch(() => setCategories([]));
  }, []);

  const fetchSkills = useCallback(
    debounce(async (categoryId: number | null, title: string, page: number, size: number) => {
      setLoading(true);
      setError(null);
      try {
        const data = await getSkillsByTitleAndCategory(categoryId, title, page, size);
        setFilteredSkills(data.skills || []);
        setTotalCount(data.totalElements);
        setTotalPages(data.totalPages);
      } catch (err) {
        setError("Erro ao carregar conhecimentos.");
      } finally {
        setLoading(false);
      }
    }, 500),
    []
  );
  useEffect(() => {
    fetchSkills(selectedCategory, searchTitle, pageIndex, perPage);

    return () => {
      fetchSkills.cancel();
    };
  }, [selectedCategory, searchTitle, pageIndex, perPage, fetchSkills]);

  const handleCategorySelect = (categoryId: number) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(null); 
    } else {
      setSelectedCategory(categoryId); 
    }
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
        contentContainerStyle={{ paddingHorizontal: 32 }}
        style={{ marginVertical: 25, maxHeight: 44, minHeight: 44 }}
      />

      {error && <Text>{error}</Text>}

      <PostCard skills={filteredSkills} />
    </VStack>
  );
}
