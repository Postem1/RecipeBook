import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Plus, X, Upload, Save, Loader } from 'lucide-react';

const RecipeForm = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(!!id);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [ingredients, setIngredients] = useState<string[]>(['']);
    const [instructions, setInstructions] = useState('');
    const [prepTime, setPrepTime] = useState<number | ''>('');
    const [cookTime, setCookTime] = useState<number | ''>('');
    const [servings, setServings] = useState<number | ''>('');
    const [category, setCategory] = useState('Dinner');
    const [photoUrl, setPhotoUrl] = useState<string | null>(null);
    const [isPrivate, setIsPrivate] = useState(false);

    const categories = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snacks'];

    const fetchRecipe = useCallback(async () => {
        if (!id) return;
        try {
            const { data, error } = await supabase
                .from('rb_recipes')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            if (data) {
                setTitle(data.title);
                setDescription(data.description || '');
                setIngredients(Array.isArray(data.ingredients) ? data.ingredients : ['']);
                setInstructions(data.instructions || '');
                setPrepTime(data.prep_time || '');
                setCookTime(data.cook_time || '');
                setServings(data.servings || '');
                setCategory(data.category || 'Dinner');
                setPhotoUrl(data.photo_url);
                setIsPrivate(data.is_private || false);
            }
        } catch (error) {
            console.error('Error fetching recipe:', error);
            navigate('/');
        } finally {
            setFetching(false);
        }
    }, [id, navigate]);

    useEffect(() => {
        if (id) {
            fetchRecipe();
        }
    }, [id, fetchRecipe]);

    const handleIngredientChange = (index: number, value: string) => {
        const newIngredients = [...ingredients];
        newIngredients[index] = value;
        setIngredients(newIngredients);
    };

    const addIngredient = () => {
        setIngredients([...ingredients, '']);
    };

    const removeIngredient = (index: number) => {
        const newIngredients = ingredients.filter((_, i) => i !== index);
        setIngredients(newIngredients);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        try {
            setLoading(true);
            const file = e.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('recipe-photos')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage
                .from('recipe-photos')
                .getPublicUrl(filePath);

            setPhotoUrl(data.publicUrl);
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Error uploading image');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        try {
            setLoading(true);
            const recipeData = {
                title,
                description,
                ingredients: ingredients.filter(i => i.trim() !== ''),
                instructions,
                prep_time: prepTime === '' ? null : Number(prepTime),
                cook_time: cookTime === '' ? null : Number(cookTime),
                servings: servings === '' ? null : Number(servings),
                category,
                photo_url: photoUrl,
                is_private: isPrivate,
                user_id: user.id
            };

            if (id) {
                const { error } = await supabase
                    .from('rb_recipes')
                    .update({ ...recipeData, updated_at: new Date() })
                    .eq('id', id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('rb_recipes')
                    .insert(recipeData);
                if (error) throw error;
            }

            navigate('/my-recipes');
        } catch (error) {
            console.error('Error saving recipe:', error);
            alert('Error saving recipe');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading...</div>;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '2rem', color: 'var(--color-primary)' }}>
                {id ? 'Edit Recipe' : 'Create New Recipe'}
            </h1>

            <form onSubmit={handleSubmit} className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                {/* Basic Info */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div style={{ gridColumn: '1 / -1' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Recipe Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                        />
                    </div>

                    <div style={{ gridColumn: '1 / -1' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Category</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                        >
                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Visibility</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', height: '42px' }}>
                            <input
                                type="checkbox"
                                id="private"
                                checked={isPrivate}
                                onChange={(e) => setIsPrivate(e.target.checked)}
                                style={{ width: '20px', height: '20px' }}
                            />
                            <label htmlFor="private">Make Private</label>
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Prep Time (mins)</label>
                        <input
                            type="number"
                            value={prepTime}
                            onChange={(e) => setPrepTime(Number(e.target.value))}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Cook Time (mins)</label>
                        <input
                            type="number"
                            value={cookTime}
                            onChange={(e) => setCookTime(Number(e.target.value))}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Servings</label>
                        <input
                            type="number"
                            value={servings}
                            onChange={(e) => setServings(Number(e.target.value))}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                        />
                    </div>
                </div>

                {/* Photo Upload */}
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Photo</label>
                    <div style={{ border: '2px dashed var(--color-border)', borderRadius: 'var(--radius-md)', padding: '2rem', textAlign: 'center', position: 'relative' }}>
                        {photoUrl ? (
                            <div style={{ position: 'relative', height: '200px' }}>
                                <img src={photoUrl} alt="Recipe" style={{ height: '100%', objectFit: 'contain', borderRadius: 'var(--radius-md)' }} />
                                <button
                                    type="button"
                                    onClick={() => setPhotoUrl(null)}
                                    style={{ position: 'absolute', top: '-10px', right: '-10px', backgroundColor: 'var(--color-error)', color: 'white', borderRadius: '50%', padding: '4px' }}
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ) : (
                            <>
                                <Upload size={48} color="var(--color-text-light)" style={{ marginBottom: '1rem' }} />
                                <p>Click to upload a photo</p>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                                />
                            </>
                        )}
                    </div>
                </div>

                {/* Ingredients */}
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Ingredients</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {ingredients.map((ing, index) => (
                            <div key={index} style={{ display: 'flex', gap: '0.5rem' }}>
                                <input
                                    type="text"
                                    value={ing}
                                    onChange={(e) => handleIngredientChange(index, e.target.value)}
                                    placeholder={`Ingredient ${index + 1}`}
                                    style={{ flex: 1, padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                                />
                                {ingredients.length > 1 && (
                                    <button type="button" onClick={() => removeIngredient(index)} style={{ color: 'var(--color-text-light)' }}>
                                        <X size={20} />
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addIngredient}
                            className="btn btn-outline"
                            style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}
                        >
                            <Plus size={16} /> Add Ingredient
                        </button>
                    </div>
                </div>

                {/* Instructions */}
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Instructions</label>
                    <textarea
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                        rows={8}
                        placeholder="Step-by-step instructions..."
                        style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                    />
                </div>

                {/* Submit */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                    <button type="button" onClick={() => navigate(-1)} className="btn btn-outline">Cancel</button>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? <Loader className="animate-spin" /> : <Save size={20} />}
                        <span>Save Recipe</span>
                    </button>
                </div>

            </form>
        </div>
    );
};

export default RecipeForm;
