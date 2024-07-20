import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LuImagePlus } from 'react-icons/lu';
import axios from 'axios';

import { Card, FormField, Loader } from '../../components';
import { Post } from '../../types/post.interface';

interface PostAPIResponse {
    success: boolean;
    data: Post[];
}

interface RenderCardsProps {
    data: Post[];
    title: string;
}

const RenderCards = ({ data, title }: RenderCardsProps) => {
    if (data?.length > 0) return data.map((post) => <Card key={post._id} {...post} />);

    return <h2 className="mt-5 font-bold text-[#6469FF] text-xl uppercase">{title}</h2>;
};

const Home = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [searchText, setSearchText] = useState<string>('');
    const [posts, setPosts] = useState<Post[]>([]);
    const [searchedPosts, setSearchedPosts] = useState<Post[]>([]);

    useEffect(() => {
        const fetchPosts = () => {
            setIsLoading(true);

            axios
                .get<PostAPIResponse>(`${import.meta.env.VITE_API_URL}/api/v1/post`)
                .then((response) => {
                    setPosts(response.data.data.reverse());
                })
                .catch((error) => console.error(error))
                .finally(() => setIsLoading(false));
        };

        fetchPosts();
    }, []);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = e.target.value;

        setSearchText(value);

        const searchResults = posts.filter(
            (post) =>
                post.name.toLowerCase().includes(value.trim().toLowerCase()) ||
                post.prompt.toLowerCase().includes(value.trim().toLowerCase())
        );

        setSearchedPosts(searchResults);
    };

    return (
        <section className="max-w-7xl mx-auto">
            <div className="flex md:flex-row gap-5 flex-col justify-between items-start">
                <div>
                    <h1 className="font-extrabold text-[#222328] text-[32px]">The Community Showcase</h1>

                    <p className="mt-2 text-[#666E75] text-[16px] max-w-[500px]">
                        Browse through a collection of imaginative and visually stunning images generated by AI
                    </p>
                </div>

                <Link
                    className="font-inter font-medium bg-[#6469FF] text-white px-6 py-3 rounded-md flex items-center gap-x-2"
                    to="/create-post">
                    Create image <LuImagePlus className="inline-block text-lg" />
                </Link>
            </div>

            <div className="mt-16">
                <FormField
                    labelName="Search posts"
                    type="text"
                    name="name"
                    placeholder="Enter name or prompt"
                    value={searchText}
                    handleChange={handleSearchChange}
                />
            </div>

            <div className="mt-10">
                {isLoading ? (
                    <div className="flex justify-center items-center">
                        <Loader />
                    </div>
                ) : (
                    <>
                        {searchText && (
                            <h2 className="font-medium text-[#666E75] text-xl mb-3">
                                Showing results for <span className="text-[#222328]">{searchText}</span>
                            </h2>
                        )}

                        <div className="grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-3">
                            {searchText ? (
                                <RenderCards data={searchedPosts} title="No search results found" />
                            ) : (
                                <RenderCards data={posts} title="No posts found" />
                            )}
                        </div>
                    </>
                )}
            </div>
        </section>
    );
};

export default Home;
