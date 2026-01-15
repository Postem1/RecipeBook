import React from 'react';
import { Clock, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

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
        <Link to={`/recipes/${recipe.id}`} className="card" style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            textDecoration: 'none',
            color: 'inherit',
            border: '1px solid rgba(0,0,0,0.03)' // Subtle border for definition
        }}>
            <div style={{ position: 'relative', width: '100%', paddingTop: '75%', backgroundColor: '#F0F0F0' }}>
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
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#FFF5E6',
                        color: '#F4D03F'
                    }}>
                        <span style={{ fontSize: '4rem' }}>🍳</span>
                    </div>
                )}

                {recipe.category && (
                    <span style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        padding: '0.4rem 0.8rem',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        color: 'var(--color-text-primary)',
                        letterSpacing: '0.02em',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                    }}>
                        {recipe.category}
                    </span>
                )}
            </div>

            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h3 style={{
                    marginBottom: '0.75rem',
                    fontSize: '1.4rem',
                    fontWeight: '800',
                    lineHeight: '1.3'
                }}>
                    {recipe.title}
                </h3>

                <p style={{
                    color: 'var(--color-text-secondary)',
                    fontSize: '0.95rem',
                    marginBottom: '1.5rem',
                    flex: 1,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    lineHeight: '1.6'
                }}>
                    {recipe.description}
                </p>

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    gap: '1.5rem',
                    marginTop: 'auto',
                    fontSize: '0.875rem',
                    color: 'var(--color-text-primary)',
                    fontWeight: '600'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Clock size={18} color="var(--color-primary-hover)" />
                        <span>{totalTime > 0 ? `${totalTime} min` : '-'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Users size={18} color="var(--color-primary-hover)" />
                        <span>{recipe.servings ? `${recipe.servings} servings` : '-'}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default RecipeCard;
