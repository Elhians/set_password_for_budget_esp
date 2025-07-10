import React, { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import authService from '../services/authService';

const PasswordDefine = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');

  console.log('le token',token);
  
  const [formData, setFormData] = useState({
    nouveauMotDePasse: '',
    confirmationMotDePasse: ''
  });
  const [erreur, setErreur] = useState('');
  const [succes, setSucces] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const gererChangement = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const soumettreFormulaire = async (e) => {
    e.preventDefault();
    setErreur('');
    setSucces('');
    setIsLoading(true);

    if (!formData.nouveauMotDePasse || !formData.confirmationMotDePasse) {
      setErreur('Tous les champs sont obligatoires');
      setIsLoading(false);
      return;
    }

    if (formData.nouveauMotDePasse !== formData.confirmationMotDePasse) {
      setErreur('Les mots de passe ne correspondent pas');
      setIsLoading(false);
      return;
    }

    if (formData.nouveauMotDePasse.length < 8) {
      setErreur('Le mot de passe doit contenir au moins 8 caractères');
      setIsLoading(false);
      return;
    }

    try {
      await authService.setPassword(
        token, 
        formData.nouveauMotDePasse
      );

      setSucces('Mot de passe défini avec succès. Redirection en cours...');
      
      setTimeout(() => {
  window.location.replace('https://frontend-gestion-budget-esp.onrender.com/');
}, 2000);

    } catch (error) {
      console.error('Erreur:', error);
      setErreur(error.response?.data?.message || 'Erreur lors de la définition du mot de passe');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card title="Définir votre mot de passe">
      <form onSubmit={soumettreFormulaire}>
        {erreur && <div className="alert error">{erreur}</div>}
        {succes && <div className="alert success">{succes}</div>}

        <div className="form-group">
          <label htmlFor="nouveauMotDePasse">Nouveau mot de passe</label>
          <input
            type="password"
            id="nouveauMotDePasse"
            value={formData.nouveauMotDePasse}
            onChange={gererChangement}
            required
            minLength="8"
          />
          <small>Le mot de passe doit contenir au moins 8 caractères</small>
        </div>

        <div className="form-group">
          <label htmlFor="confirmationMotDePasse">Confirmer le mot de passe</label>
          <input
            type="password"
            id="confirmationMotDePasse"
            value={formData.confirmationMotDePasse}
            onChange={gererChangement}
            required
            minLength="8"
          />
        </div>

        <div className="form-actions">
          <Button type="primary" disabled={isLoading}>
            {isLoading ? 'Chargement...' : 'Définir le mot de passe'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default PasswordDefine;
