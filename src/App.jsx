import React, { useState } from 'react';
import { FileText, Folder, Settings, Sparkles, Copy, Check, RefreshCw } from 'lucide-react';

const SmartFilenameGenerator = () => {
  const [type, setType] = useState('file');
  const [description, setDescription] = useState('');
  const [context, setContext] = useState('');
  const [convention, setConvention] = useState('camelCase');
  const [prefix, setPrefix] = useState('');
  const [suffix, setSuffix] = useState('');
  const [includeDate, setIncludeDate] = useState(false);
  const [includeVersion, setIncludeVersion] = useState(false);
  const [generated, setGenerated] = useState([]);
  const [copied, setCopied] = useState(null);
  const [showSettings, setShowSettings] = useState(false);

  const conventions = {
    camelCase: { name: 'camelCase', example: 'myFileName' },
    PascalCase: { name: 'PascalCase', example: 'MyFileName' },
    snake_case: { name: 'snake_case', example: 'my_file_name' },
    'kebab-case': { name: 'kebab-case', example: 'my-file-name' },
    lowercase: { name: 'lowercase', example: 'myfilename' },
    UPPERCASE: { name: 'UPPERCASE', example: 'MYFILENAME' }
  };

  const applyConvention = (text, conv) => {
    text = text.trim().replace(/[^\w\s-]/g, '');
    
    switch(conv) {
      case 'camelCase':
        return text.split(/[\s_-]+/).map((word, i) => 
          i === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join('');
      case 'PascalCase':
        return text.split(/[\s_-]+/).map(word => 
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join('');
      case 'snake_case':
        return text.toLowerCase().split(/[\s-]+/).join('_');
      case 'kebab-case':
        return text.toLowerCase().split(/[\s_]+/).join('-');
      case 'lowercase':
        return text.toLowerCase().replace(/[\s_-]+/g, '');
      case 'UPPERCASE':
        return text.toUpperCase().replace(/[\s-]+/g, '_');
      default:
        return text;
    }
  };

  const generateNames = () => {
    if (!description.trim()) return;

    const names = [];
    const baseWords = description.toLowerCase().split(/\s+/).filter(w => w.length > 0);
    const contextWords = context.toLowerCase().split(/\s+/).filter(w => w.length > 0);

    const date = includeDate ? new Date().toISOString().split('T')[0].replace(/-/g, '') : '';
    const version = includeVersion ? 'v1' : '';

    // Génération principale
    const mainName = applyConvention(description, convention);
    names.push({
      name: `${prefix}${mainName}${suffix}${date}${version}`,
      category: 'Principal',
      description: 'Nom basé sur votre description'
    });

    // Avec contexte
    if (context.trim()) {
      const contextName = applyConvention(`${context} ${description}`, convention);
      names.push({
        name: `${prefix}${contextName}${suffix}${date}${version}`,
        category: 'Avec contexte',
        description: 'Inclut le contexte du projet'
      });
    }

    // Variations intelligentes
    if (type === 'file') {
      const extensions = ['.js', '.ts', '.jsx', '.tsx', '.py', '.txt', '.md', '.json'];
      const smartExt = baseWords.includes('component') || baseWords.includes('composant') ? '.jsx' :
                       baseWords.includes('typescript') ? '.ts' :
                       baseWords.includes('python') ? '.py' :
                       baseWords.includes('config') || baseWords.includes('configuration') ? '.json' :
                       baseWords.includes('doc') || baseWords.includes('readme') ? '.md' : '.txt';
      
      names.push({
        name: `${prefix}${mainName}${suffix}${date}${version}${smartExt}`,
        category: 'Fichier avec extension',
        description: 'Extension détectée automatiquement'
      });

      // Patterns courants
      if (baseWords.includes('test')) {
        names.push({
          name: `${mainName}.test.js`,
          category: 'Pattern de test',
          description: 'Convention de test standard'
        });
      }

      if (baseWords.includes('config') || baseWords.includes('configuration')) {
        names.push({
          name: `${mainName}.config.js`,
          category: 'Fichier de configuration',
          description: 'Format de configuration standard'
        });
      }
    }

    // Variations de style
    Object.keys(conventions).slice(0, 3).forEach(conv => {
      if (conv !== convention) {
        const variantName = applyConvention(description, conv);
        names.push({
          name: `${prefix}${variantName}${suffix}${date}${version}`,
          category: `Style ${conventions[conv].name}`,
          description: `Alternative en ${conventions[conv].name}`
        });
      }
    });

    // Noms courts
    if (baseWords.length > 2) {
      const shortName = applyConvention(baseWords.slice(0, 2).join(' '), convention);
      names.push({
        name: `${prefix}${shortName}${suffix}${date}${version}`,
        category: 'Version courte',
        description: 'Nom raccourci pour la simplicité'
      });
    }

    // Noms descriptifs
    if (contextWords.length > 0) {
      const descriptiveName = applyConvention(`${contextWords[0]} ${baseWords[0]}`, convention);
      names.push({
        name: `${prefix}${descriptiveName}${suffix}${date}${version}`,
        category: 'Descriptif',
        description: 'Combine contexte et description principale'
      });
    }

    setGenerated(names);
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopied(index);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl mb-4 shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Générateur de Noms Intelligents
          </h1>
          <p className="text-gray-600">Créez des noms de fichiers et répertoires professionnels en quelques secondes</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-6">
          {/* Type Selection */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setType('file')}
              className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-300 ${
                type === 'file'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <FileText className="w-5 h-5 inline mr-2" />
              Fichier
            </button>
            <button
              onClick={() => setType('folder')}
              className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-300 ${
                type === 'folder'
                  ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Folder className="w-5 h-5 inline mr-2" />
              Répertoire
            </button>
          </div>

          {/* Input Fields */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description du {type === 'file' ? 'fichier' : 'répertoire'}
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex: Gestion des utilisateurs, Rapport mensuel, Configuration API..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Contexte du projet (optionnel)
              </label>
              <input
                type="text"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="Ex: E-commerce, Backend, Frontend, Database..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Settings Toggle */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 font-medium transition-colors"
          >
            <Settings className="w-5 h-5" />
            Paramètres avancés
            <span className={`transform transition-transform ${showSettings ? 'rotate-180' : ''}`}>▼</span>
          </button>

          {/* Advanced Settings */}
          {showSettings && (
            <div className="bg-gray-50 rounded-2xl p-6 space-y-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Convention de nommage
                  </label>
                  <select
                    value={convention}
                    onChange={(e) => setConvention(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors bg-white"
                  >
                    {Object.entries(conventions).map(([key, val]) => (
                      <option key={key} value={key}>
                        {val.name} ({val.example})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Préfixe
                  </label>
                  <input
                    type="text"
                    value={prefix}
                    onChange={(e) => setPrefix(e.target.value)}
                    placeholder="Ex: app_, user_, data_"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Suffixe
                  </label>
                  <input
                    type="text"
                    value={suffix}
                    onChange={(e) => setSuffix(e.target.value)}
                    placeholder="Ex: _final, _backup, _temp"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeDate}
                      onChange={(e) => setIncludeDate(e.target.checked)}
                      className="w-5 h-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Inclure la date</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeVersion}
                      onChange={(e) => setIncludeVersion(e.target.checked)}
                      className="w-5 h-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Inclure version</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={generateNames}
            disabled={!description.trim()}
            className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <Sparkles className="w-5 h-5 inline mr-2" />
            Générer les noms
          </button>
        </div>

        {/* Results */}
        {generated.length > 0 && (
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Suggestions générées</h2>
              <button
                onClick={generateNames}
                className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Régénérer
              </button>
            </div>

            <div className="space-y-3">
              {generated.map((item, index) => (
                <div
                  key={index}
                  className="group bg-gradient-to-r from-gray-50 to-white border-2 border-gray-100 rounded-xl p-4 hover:border-blue-300 transition-all duration-300 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-lg">
                          {item.category}
                        </span>
                      </div>
                      <code className="text-lg font-mono text-gray-800 break-all">
                        {item.name}
                      </code>
                      <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(item.name, index)}
                      className="flex-shrink-0 p-3 hover:bg-blue-100 rounded-lg transition-colors group"
                    >
                      {copied === index ? (
                        <Check className="w-5 h-5 text-green-500" />
                      ) : (
                        <Copy className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {generated.length === 0 && (
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Prêt à générer des noms intelligents
            </h3>
            <p className="text-gray-600">
              Remplissez les champs ci-dessus et cliquez sur "Générer" pour obtenir des suggestions personnalisées
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartFilenameGenerator;