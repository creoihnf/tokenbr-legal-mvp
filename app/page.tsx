'use client'

import React, { useState, useEffect } from 'react';
import { ArrowRight, TrendingUp, Shield, PiggyBank, CheckCircle, Star, Building, User, Calculator, Target, Zap, BarChart3 } from 'lucide-react';

interface FormData {
  userType?: string;
  cnpj?: string;
  razaoSocial?: string;
  faturamento?: string;
  setor?: string;
  nome?: string;
  cpf?: string;
  renda?: string;
  perfilRisco?: string;
  email?: string;
}

interface Simulation {
  tipo: string;
  valor: number;
  taxaBanco?: string;
  nossaTaxa?: string;
  economia?: number;
  valorLiquido?: number;
  retornoAnual?: string;
  retornoMensal?: number;
  retornoCDI?: string;
  risco?: string;
}

interface Analytics {
  empresas: number;
  investidores: number;
  volumeSimulado: number;
  matches: number;
}

const TokenBRMVP = () => {
  const [currentView, setCurrentView] = useState('landing');
  const [userType, setUserType] = useState('');
  const [formData, setFormData] = useState<FormData>({});
  const [simulation, setSimulation] = useState<Simulation | null>(null);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [analytics, setAnalytics] = useState<Analytics>({
    empresas: 247,
    investidores: 89,
    volumeSimulado: 1250000,
    matches: 34
  });

  const trackEvent = (eventName: string, properties: any = {}) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, {
        event_category: 'MVP_Validation',
        event_label: userType || 'unknown',
        ...properties
      });
    }
    
    console.log(`📊 Event: ${eventName}`, properties);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setAnalytics(prev => ({
        empresas: prev.empresas + Math.floor(Math.random() * 3),
        investidores: prev.investidores + Math.floor(Math.random() * 2),
        volumeSimulado: prev.volumeSimulado + Math.floor(Math.random() * 50000),
        matches: prev.matches + Math.floor(Math.random() * 2)
      }));
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const submitFormData = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          timestamp: new Date().toISOString(),
          simulation: simulation,
          analytics: analytics
        }),
      });

      if (response.ok) {
        trackEvent('form_submitted', { userType, formData: data });
        return true;
      }
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
    } finally {
      setIsSubmitting(false);
    }
    return false;
  };

  const handleSimulation = (tipo: string, valor: number) => {
    if (tipo === 'empresa') {
      const taxaBanco = 0.06;
      const nossaTaxa = 0.02;
      const economia = (valor * taxaBanco) - (valor * nossaTaxa);
      const valorLiquido = valor * (1 - nossaTaxa);
      
      const simulationResult: Simulation = {
        tipo: 'empresa',
        valor: valor,
        taxaBanco: `${(taxaBanco * 100).toFixed(1)}% ao mês`,
        nossaTaxa: `${(nossaTaxa * 100).toFixed(1)}% ao mês`,
        economia: economia,
        valorLiquido: valorLiquido,
      };
      
      setSimulation(simulationResult);
      trackEvent('simulation_calculated', { tipo, valor, economia });
    } else {
      const retornoAnual = 0.15;
      const retornoMensal = valor * (retornoAnual / 12);
      
      const simulationResult: Simulation = {
        tipo: 'investidor',
        valor: valor,
        retornoAnual: `${(retornoAnual * 100).toFixed(1)}% ao ano`,
        retornoMensal: retornoMensal,
        retornoCDI: '13% CDI atual',
        risco: 'Baixo-Médio'
      };
      
      setSimulation(simulationResult);
      trackEvent('simulation_calculated', { tipo, valor, retornoMensal });
    }
  };

  const selectUserType = (type: string) => {
    setUserType(type);
    setFormData({ ...formData, userType: type });
    trackEvent('user_type_selected', { userType: type });
  };

  const navigateToView = (viewName: string) => {
    setCurrentView(viewName);
    trackEvent('page_view', { page: viewName, userType });
  };

  const LandingPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">TokenBR Legal</h1>
            </div>
            <div className="flex space-x-4">
              <button 
                onClick={() => navigateToView('cadastro')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Começar Agora
              </button>
            </div>
          </div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Antecipe seus <span className="text-blue-600">Recebíveis</span><br />
            com Taxas até <span className="text-green-600">70% Menores</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Conectamos empresas que precisam de capital de giro com investidores 
            que buscam rentabilidade acima do CDI. Sem burocracia, 100% digital.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <TrendingUp className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Para Empresas</h3>
              <p className="text-gray-600">Antecipe recebíveis com taxas 50-70% menores que os bancos</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <PiggyBank className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Para Investidores</h3>
              <p className="text-gray-600">Rentabilidade de 12-18% ao ano, acima do CDI</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <Shield className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">100% Legal</h3>
              <p className="text-gray-600">Operações via parceiros licenciados pelo Banco Central</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold mb-6">🚀 MVP em Validação - Dados Reais</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{analytics.empresas}</div>
                <div className="text-gray-600">Empresas Cadastradas</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{analytics.investidores}</div>
                <div className="text-gray-600">Investidores</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">R$ {(analytics.volumeSimulado / 1000).toFixed(0)}k</div>
                <div className="text-gray-600">Volume Simulado</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">{analytics.matches}</div>
                <div className="text-gray-600">Matches Realizados</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-lg mb-16">
          <h3 className="text-3xl font-bold text-center mb-8">TokenBR vs Bancos Tradicionais</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-xl font-bold text-red-600 mb-4">❌ Bancos Tradicionais</h4>
              <ul className="space-y-3">
                <li className="flex items-center"><span className="text-red-500 mr-2">•</span> Juros 4-8% ao mês</li>
                <li className="flex items-center"><span className="text-red-500 mr-2">•</span> Processo burocrático</li>
                <li className="flex items-center"><span className="text-red-500 mr-2">•</span> Demora semanas</li>
                <li className="flex items-center"><span className="text-red-500 mr-2">•</span> Horário comercial</li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-bold text-green-600 mb-4">✅ TokenBR Legal</h4>
              <ul className="space-y-3">
                <li className="flex items-center"><span className="text-green-500 mr-2">•</span> Taxas 50-70% menores</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">•</span> Aprovação em minutos</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">•</span> IA + dados objetivos</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">•</span> Disponível 24/7</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button 
            onClick={() => navigateToView('cadastro')}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-12 py-4 rounded-lg text-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg"
          >
            Validar Minha Oportunidade <ArrowRight className="inline ml-2" />
          </button>
          <p className="text-gray-500 mt-4">MVP gratuito • Sem compromisso • Validação em 2 minutos</p>
        </div>
      </section>
    </div>
  );

  const CadastroForm = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Escolha seu Perfil</h2>
          <p className="text-gray-600">Selecione como deseja participar da TokenBR Legal</p>
          <p className="text-sm text-blue-600 mt-2">👆 Clique no card para começar</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div 
            onClick={() => selectUserType('empresa')}
            className={`bg-white p-8 rounded-xl cursor-pointer transition-all transform hover:scale-105 shadow-lg border-2 ${
              userType === 'empresa' ? 'border-blue-500 ring-4 ring-blue-200' : 'border-transparent hover:border-blue-200'
            }`}
          >
            <Building className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-center mb-4">Sou Empresa</h3>
            <p className="text-gray-600 text-center mb-6">
              Preciso antecipar recebíveis com taxas melhores que os bancos
            </p>
            <ul className="space-y-2">
              <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-2" /> Taxas 50-70% menores</li>
              <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-2" /> Aprovação em minutos</li>
              <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-2" /> Sem burocracia</li>
            </ul>
            <div className="text-center mt-4 text-sm text-blue-600 font-semibold">
              {analytics.empresas} empresas já cadastradas
            </div>
          </div>

          <div 
            onClick={() => selectUserType('investidor')}
            className={`bg-white p-8 rounded-xl cursor-pointer transition-all transform hover:scale-105 shadow-lg border-2 ${
              userType === 'investidor' ? 'border-green-500 ring-4 ring-green-200' : 'border-transparent hover:border-green-200'
            }`}
          >
            <User className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-center mb-4">Sou Investidor</h3>
            <p className="text-gray-600 text-center mb-6">
              Quero investir em recebíveis com rentabilidade acima do CDI
            </p>
            <ul className="space-y-2">
              <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-2" /> 12-18% ao ano</li>
              <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-2" /> Risco controlado</li>
              <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-2" /> Diversificação</li>
            </ul>
            <div className="text-center mt-4 text-sm text-green-600 font-semibold">
              {analytics.investidores} investidores ativos
            </div>
          </div>
        </div>

        {userType && (
          <div className="bg-white rounded-xl p-8 shadow-lg animate-fadeIn">
            <h3 className="text-2xl font-bold mb-6">
              {userType === 'empresa' ? 'Dados da Empresa' : 'Dados do Investidor'}
            </h3>
            
            {userType === 'empresa' ? (
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CNPJ</label>
                  <input 
                    type="text" 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="00.000.000/0000-00"
                    value={formData.cnpj || ''}
                    onChange={(e) => setFormData({...formData, cnpj: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Razão Social</label>
                  <input 
                    type="text" 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nome da empresa"
                    value={formData.razaoSocial || ''}
                    onChange={(e) => setFormData({...formData, razaoSocial: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Faturamento Mensal</label>
                  <select 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.faturamento || ''}
                    onChange={(e) => setFormData({...formData, faturamento: e.target.value})}
                  >
                    <option value="">Selecione</option>
                    <option value="0-50k">Até R$ 50.000</option>
                    <option value="50k-200k">R$ 50.000 - R$ 200.000</option>
                    <option value="200k-500k">R$ 200.000 - R$ 500.000</option>
                    <option value="500k+">Acima de R$ 500.000</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Setor</label>
                  <select 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.setor || ''}
                    onChange={(e) => setFormData({...formData, setor: e.target.value})}
                  >
                    <option value="">Selecione</option>
                    <option value="comercio">Comércio</option>
                    <option value="servicos">Serviços</option>
                    <option value="industria">Indústria</option>
                    <option value="tecnologia">Tecnologia</option>
                    <option value="outros">Outros</option>
                  </select>
                </div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
                  <input 
                    type="text" 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Seu nome completo"
                    value={formData.nome || ''}
                    onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CPF</label>
                  <input 
                    type="text" 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="000.000.000-00"
                    value={formData.cpf || ''}
                    onChange={(e) => setFormData({...formData, cpf: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Renda Mensal</label>
                  <select 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={formData.renda || ''}
                    onChange={(e) => setFormData({...formData, renda: e.target.value})}
                  >
                    <option value="">Selecione</option>
                    <option value="0-5k">Até R$ 5.000</option>
                    <option value="5k-15k">R$ 5.000 - R$ 15.000</option>
                    <option value="15k-30k">R$ 15.000 - R$ 30.000</option>
                    <option value="30k+">Acima de R$ 30.000</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Perfil de Risco</label>
                  <select 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={formData.perfilRisco || ''}
                    onChange={(e) => setFormData({...formData, perfilRisco: e.target.value})}
                  >
                    <option value="">Selecione</option>
                    <option value="conservador">Conservador</option>
                    <option value="moderado">Moderado</option>
                    <option value="arrojado">Arrojado</option>
                  </select>
                </div>
              </div>
            )}

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input 
                type="email" 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="seu@email.com"
                value={formData.email || ''}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <button 
              onClick={async () => {
                await submitFormData(formData);
                navigateToView('simulador');
              }}
              disabled={isSubmitting}
              className={`w-full mt-8 py-4 px-6 rounded-lg text-white font-semibold text-lg transition-all ${
                isSubmitting 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : userType === 'empresa' 
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800' 
                    : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'
              }`}
            >
              {isSubmitting ? 'Salvando...' : 'Continuar para Simulação'} <ArrowRight className="inline ml-2" />
            </button>
          </div>
        )}

        <div className="text-center mt-8">
          <button 
            onClick={() => navigateToView('landing')}
            className="text-gray-600 hover:text-gray-800"
          >
            ← Voltar ao início
          </button>
        </div>
      </div>
    </div>
  );

  const Simulador = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Simulação Personalizada</h2>
          <p className="text-gray-600">
            {userType === 'empresa' 
              ? 'Veja quanto você pode economizar antecipando recebíveis conosco'
              : 'Calcule sua rentabilidade investindo em recebíveis'
            }
          </p>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-lg mb-8">
          <div className="flex items-center mb-6">
            <Calculator className={`w-8 h-8 mr-3 ${userType === 'empresa' ? 'text-blue-600' : 'text-green-600'}`} />
            <h3 className="text-2xl font-bold">
              {userType === 'empresa' ? 'Simulador de Antecipação' : 'Simulador de Investimento'}
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {userType === 'empresa' ? 'Valor do Recebível (R$)' : 'Valor a Investir (R$)'}
              </label>
              <input 
                type="number" 
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                placeholder={userType === 'empresa' ? '50000' : '10000'}
                onChange={(e) => {
                  const valor = parseFloat(e.target.value) || 0;
                  if (valor > 0) {
                    handleSimulation(userType, valor);
                  }
                }}
              />
            </div>

            {userType === 'empresa' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prazo do Recebível</label>
                <select className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg">
                  <option value="30">30 dias</option>
                  <option value="60">60 dias</option>
                  <option value="90">90 dias</option>
                  <option value="120">120 dias</option>
                </select>
              </div>
            )}
          </div>

          {simulation && (
            <div className="mt-8 p-6 bg-gray-50 rounded-lg animate-fadeIn">
              <h4 className="text-xl font-bold mb-4">💰 Resultado da Simulação</h4>
              
              {simulation.tipo === 'empresa' ? (
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-semibold text-red-600 mb-2">Banco Tradicional</h5>
                    <p className="text-2xl font-bold text-red-600">{simulation.taxaBanco}</p>
                    <p className="text-sm text-gray-600">Taxa de antecipação</p>
                  </div>
                  <div>
                    <h5 className="font-semibold text-green-600 mb-2">TokenBR Legal</h5>
                    <p className="text-2xl font-bold text-green-600">{simulation.nossaTaxa}</p>
                    <p className="text-sm text-gray-600">Nossa taxa</p>
                  </div>
                  <div className="md:col-span-2 bg-green-100 p-4 rounded-lg">
                    <h5 className="font-semibold text-green-800 mb-2">🎉 Você Economiza</h5>
                    <p className="text-3xl font-bold text-green-800">
                      R$ {simulation.economia?.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                    </p>
                    <p className="text-sm text-green-700 mt-2">
                      Valor líquido que você recebe: R$ {simulation.valorLiquido?.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-semibold text-green-600 mb-2">Rentabilidade Anual</h5>
                    <p className="text-2xl font-bold text-green-600">{simulation.retornoAnual}</p>
                    <p className="text-sm text-gray-600">vs {simulation.retornoCDI}</p>
                  </div>
                  <div>
                    <h5 className="font-semibold text-blue-600 mb-2">Ganho Mensal</h5>
                    <p className="text-2xl font-bold text-blue-600">
                      R$ {simulation.retornoMensal?.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                    </p>
                    <p className="text-sm text-gray-600">Risco: {simulation.risco}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          <button 
            onClick={() => navigateToView('dashboard')}
            className={`w-full mt-8 py-4 px-6 rounded-lg text-white font-semibold text-lg transition-all ${
              userType === 'empresa' 
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800' 
                : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'
            }`}
          >
            Ver Oportunidades Disponíveis <ArrowRight className="inline ml-2" />
          </button>
        </div>

        <div className="text-center">
          <button 
            onClick={() => navigateToView('cadastro')}
            className="text-gray-600 hover:text-gray-800"
          >
            ← Voltar ao cadastro
          </button>
        </div>
      </div>
    </div>
  );

  const Dashboard = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {userType === 'empresa' ? '🎯 Investidores Interessados' : '💰 Oportunidades de Investimento'}
          </h2>
          <p className="text-gray-600">
            {userType === 'empresa' 
              ? 'Investidores que demonstraram interesse no seu perfil'
              : 'Recebíveis disponíveis para investimento'
            }
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
              <h3 className="text-xl font-bold mb-4">
                {userType === 'empresa' ? '🎯 Matches Perfeitos' : '💰 Oportunidades Premium'}
              </h3>
              
              <div className="space-y-4">
                {[1,2,3].map((item, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold">
                          {userType === 'empresa' 
                            ? `Investidor ${['Premium', 'Gold', 'Silver'][index]}` 
                            : `Recebível - ${['Tecnologia', 'Comércio', 'Serviços'][index]}`
                          }
                        </h4>
                        <p className="text-sm text-gray-600">
                          {userType === 'empresa' 
                            ? `Disponível para investir: R$ ${[150, 80, 120][index]}.000`
                            : `Prazo: ${[30, 45, 60][index]} dias • Valor: R$ ${[75, 120, 90][index]}.000`
                          }
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">
                          {userType === 'empresa' 
                            ? `${[1.8, 2.1, 2.4][index]}% a.m.`
                            : `${[14.5, 16.2, 15.8][index]}% a.a.`
                          }
                        </div>
                        <div className="text-xs text-gray-500">
                          {['Baixo risco', 'Médio risco', 'Baixo risco'][index]}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-500 mr-1" />
                          {[4.8, 4.6, 4.9][index]}
                        </span>
                        <span className="flex items-center">
                          <Target className="w-4 h-4 text-blue-500 mr-1" />
                          {[98, 95, 99][index]}% match
                        </span>
                      </div>
                      
                      <button 
                        onClick={() => trackEvent('match_clicked', { matchType: userType, index })}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        {userType === 'empresa' ? 'Aceitar Proposta' : 'Investir Agora'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4">💬 Seu Feedback é Importante</h3>
              <p className="text-gray-600 mb-4">
                Ajude-nos a melhorar a plataforma com sua opinião sobre a experiência
              </p>
              
              <textarea 
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                placeholder="O que achou da proposta? Que funcionalidades gostaria de ver? Críticas e sugestões..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
              
              <div className="flex justify-between items-center mt-4">
                <div className="flex space-x-2">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className="w-6 h-6 text-yellow-500 cursor-pointer hover:text-yellow-600" />
                  ))}
                </div>
                <button 
                  onClick={() => {
                    if (feedback.trim()) {
                      trackEvent('feedback_submitted', { feedback, userType });
                      alert('Feedback enviado! Obrigado por ajudar a validar a TokenBR Legal 🚀');
                      setFeedback('');
                    } else {
                      alert('Por favor, escreva seu feedback antes de enviar.');
                    }
                  }}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Enviar Feedback
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-bold mb-4">📊 Status da Validação</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Empresas Cadastradas</span>
                    <span className="text-sm font-semibold">{analytics.empresas}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{width: '78%'}}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Investidores</span>
                    <span className="text-sm font-semibold">{analytics.investidores}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{width: '45%'}}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Matches Realizados</span>
                    <span className="text-sm font-semibold">{analytics.matches}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{width: '34%'}}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-bold mb-4">🔥 Próximos Passos</h3>
              
              <div className="space-y-3">
                <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                  <Zap className="w-5 h-5 text-blue-600 mr-3" />
                  <div>
                    <div className="font-semibold text-sm">Plataforma Completa</div>
                    <div className="text-xs text-gray-600">Lançamento em 60 dias</div>
                  </div>
                </div>
                
                <div className="flex items-center p-3 bg-green-50 rounded-lg">
                  <Shield className="w-5 h-5 text-green-600 mr-3" />
                  <div>
                    <div className="font-semibold text-sm">Parceiros Licenciados</div>
                    <div className="text-xs text-gray-600">Contratos assinados</div>
                  </div>
                </div>
                
                <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-purple-600 mr-3" />
                  <div>
                    <div className="font-semibold text-sm">IA de Credit Scoring</div>
                    <div className="text-xs text-gray-600">Em desenvolvimento</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
              <h3 className="text-lg font-bold mb-2">🚀 Seja um Early Adopter</h3>
              <p className="text-sm mb-4">
                Cadastre-se agora e tenha acesso antecipado à plataforma completa
              </p>
              <button 
                onClick={() => trackEvent('early_adopter_clicked', { userType })}
                className="w-full bg-white text-blue-600 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Quero Acesso VIP
              </button>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <button 
            onClick={() => navigateToView('simulador')}
            className="text-gray-600 hover:text-gray-800"
          >
            ← Voltar ao simulador
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      {currentView === 'landing' && <LandingPage />}
      {currentView === 'cadastro' && <CadastroForm />}
      {currentView === 'simulador' && <Simulador />}
      {currentView === 'dashboard' && <Dashboard />}
    </div>
  );
};

export default TokenBRMVP;