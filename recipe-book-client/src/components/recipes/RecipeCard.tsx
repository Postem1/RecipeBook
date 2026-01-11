import React from 'react';
import { Clock, Users } from 'lucide-react'; import { Link } from 'react-router-dom';

export interface Recipe {
    id: string;
    title: string;
    description: string;
    photo_url: string | null;
    prep_time: number | null;
    cook_time: number | null;
    servings: number | null;
    category: string | null;
    is_private?: boolean;
}

interface RecipeCardProps {
    recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
    const totalTime = (recipe.prep_time || 0) + (recipe.cook_time || 0);

    return (
        <Link to={`/recipes/${recipe.id}`} className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%', textDecoration: 'none', color: 'inherit' }}>
            <div style={{ position: 'relative', width: '100%', paddingTop: '66%', backgroundColor: '#eee' }}>
                {recipe.photo_url ? (
                    <img
                        src={recipe.photo_url}
                        alt={recipe.title}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                        }}
                    />
                ) : (
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#e0e0e0', color: '#999' }}>
                        <span style={{ fontSize: '3rem' }}>🍳</span>
                    </div>
                )}

                {recipe.category && (
                    <span style={{
                        position: 'absolute',
                        top: '0.5rem',
                        right: '0.5rem',
                        backgroundColor: 'rgba(255,255,255,0.9)',
                        padding: '0.25rem 0.5rem',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        color: 'var(--color-primary)'
                    }}>
                        {recipe.category}
                    </span>
                )}
            </div>

            <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h3 style={{ marginBottom: '0.5rem', fontSize: '1.25rem' }}>{recipe.title}</h3>
                <p style={{ color: 'var(--color-text-light)', fontSize: '0.875rem', marginBottom: '1rem', flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {recipe.description}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', fontSize: '0.875rem', color: 'var(--color-text-light)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Clock size={16} />
                        <span>{totalTime > 0 ? `${totalTime}m` : '-'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Users size={16} />
                        <span>{recipe.servings || '-'}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default RecipeCard;
