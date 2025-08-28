/**
 * Sidebar JavaScript - Menu sanduíche responsivo
 * Sistema ERP - Controle da barra lateral
 */

class SidebarManager {
    constructor() {
        this.sidebar = document.getElementById('sidebar');
        this.sidebarToggle = document.getElementById('sidebarToggle');
        this.sidebarOverlay = document.getElementById('sidebarOverlay');
        this.mainContent = document.getElementById('mainContent');
        this.isDesktop = window.innerWidth >= 992;
        this.isOpen = false;
        
        this.init();
    }
    
    init() {
        // Event listeners
        this.sidebarToggle.addEventListener('click', () => this.toggle());
        this.sidebarOverlay.addEventListener('click', () => this.close());
        
        // Listener para redimensionamento da janela
        window.addEventListener('resize', () => this.handleResize());
        
        // Listener para tecla ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
        
        // Inicializar estado baseado no tamanho da tela
        this.handleResize();
        
        // Ativar dropdowns do sidebar
        this.initDropdowns();
        
        // Marcar item ativo baseado na URL atual
        this.setActiveMenuItem();
    }
    
    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }
    
    open() {
        this.isOpen = true;
        this.sidebar.classList.add('show');
        
        if (!this.isDesktop) {
            this.sidebarOverlay.classList.add('show');
            document.body.style.overflow = 'hidden';
        } else {
            this.mainContent.classList.add('shifted');
        }
        
        // Adicionar classe para animação
        this.sidebar.classList.add('fade-in');
        
        // Focar no primeiro item do menu para acessibilidade
        const firstMenuItem = this.sidebar.querySelector('.sidebar-item');
        if (firstMenuItem) {
            firstMenuItem.focus();
        }
    }
    
    close() {
        this.isOpen = false;
        this.sidebar.classList.remove('show');
        this.sidebarOverlay.classList.remove('show');
        this.mainContent.classList.remove('shifted');
        document.body.style.overflow = '';
        
        // Remover classe de animação após um tempo
        setTimeout(() => {
            this.sidebar.classList.remove('fade-in');
        }, 300);
    }
    
    handleResize() {
        const wasDesktop = this.isDesktop;
        this.isDesktop = window.innerWidth >= 992;
        
        // Se mudou de mobile para desktop
        if (!wasDesktop && this.isDesktop) {
            this.sidebarOverlay.classList.remove('show');
            document.body.style.overflow = '';
            
            // No desktop, manter sidebar aberta por padrão
            if (!this.isOpen) {
                this.open();
            }
        }
        
        // Se mudou de desktop para mobile
        if (wasDesktop && !this.isDesktop) {
            this.close();
        }
    }
    
    initDropdowns() {
        const dropdownToggles = this.sidebar.querySelectorAll('.dropdown-toggle');
        
        dropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                
                const target = toggle.getAttribute('data-bs-target');
                const dropdown = document.querySelector(target);
                
                if (dropdown) {
                    // Fechar outros dropdowns
                    const otherDropdowns = this.sidebar.querySelectorAll('.collapse.show');
                    otherDropdowns.forEach(other => {
                        if (other !== dropdown) {
                            other.classList.remove('show');
                            const otherToggle = this.sidebar.querySelector(`[data-bs-target="#${other.id}"]`);
                            if (otherToggle) {
                                otherToggle.classList.remove('active');
                            }
                        }
                    });
                    
                    // Toggle do dropdown atual
                    dropdown.classList.toggle('show');
                    toggle.classList.toggle('active');
                    
                    // Animar ícone
                    const icon = toggle.querySelector('.fa-chevron-down');
                    if (icon) {
                        icon.style.transform = dropdown.classList.contains('show') 
                            ? 'rotate(180deg)' 
                            : 'rotate(0deg)';
                    }
                }
            });
        });
    }
    
    setActiveMenuItem() {
        const currentPath = window.location.pathname;
        const menuItems = this.sidebar.querySelectorAll('.sidebar-item, .sidebar-subitem');
        
        menuItems.forEach(item => {
            item.classList.remove('active');
            
            const href = item.getAttribute('href');
            if (href && href === currentPath) {
                item.classList.add('active');
                
                // Se for um subitem, abrir o dropdown pai
                if (item.classList.contains('sidebar-subitem')) {
                    const dropdown = item.closest('.collapse');
                    if (dropdown) {
                        dropdown.classList.add('show');
                        const toggle = this.sidebar.querySelector(`[data-bs-target="#${dropdown.id}"]`);
                        if (toggle) {
                            toggle.classList.add('active');
                            const icon = toggle.querySelector('.fa-chevron-down');
                            if (icon) {
                                icon.style.transform = 'rotate(180deg)';
                            }
                        }
                    }
                }
            }
        });
    }
}

// Utilitários adicionais
class Utils {
    static showToast(message, type = 'info') {
        // Criar toast dinamicamente
        const toastContainer = document.getElementById('toast-container') || this.createToastContainer();
        
        const toastEl = document.createElement('div');
        toastEl.className = `toast align-items-center text-bg-${type} border-0`;
        toastEl.setAttribute('role', 'alert');
        toastEl.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">${message}</div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        `;
        
        toastContainer.appendChild(toastEl);
        
        const toast = new bootstrap.Toast(toastEl);
        toast.show();
        
        // Remover elemento após esconder
        toastEl.addEventListener('hidden.bs.toast', () => {
            toastEl.remove();
        });
    }
    
    static createToastContainer() {
        const container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        container.style.zIndex = '1055';
        document.body.appendChild(container);
        return container;
    }
    
    static confirmDelete(message = 'Tem certeza que deseja excluir este item?') {
        return new Promise((resolve) => {
            const result = confirm(message);
            resolve(result);
        });
    }
    
    static formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    }
    
    static formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    }
    
    static formatDateTime(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString('pt-BR');
    }
    
    static validateCPF(cpf) {
        cpf = cpf.replace(/[^\d]+/g, '');
        if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false;
        
        const digits = cpf.split('').map(el => +el);
        const rest = (count) => {
            return ((digits.slice(0, count-12).reduce((soma, el, index) => 
                (soma + el * (count-index)), 0) * 10) % 11) % 10;
        };
        
        return rest(10) === digits[9] && rest(11) === digits[10];
    }
    
    static validateCNPJ(cnpj) {
        cnpj = cnpj.replace(/[^\d]+/g, '');
        if (cnpj.length !== 14) return false;
        
        if (cnpj === "00000000000000" || 
            cnpj === "11111111111111" || 
            cnpj === "22222222222222" || 
            cnpj === "33333333333333" || 
            cnpj === "44444444444444" || 
            cnpj === "55555555555555" || 
            cnpj === "66666666666666" || 
            cnpj === "77777777777777" || 
            cnpj === "88888888888888" || 
            cnpj === "99999999999999") return false;
        
        let tamanho = cnpj.length - 2;
        let numeros = cnpj.substring(0, tamanho);
        let digitos = cnpj.substring(tamanho);
        let soma = 0;
        let pos = tamanho - 7;
        
        for (let i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2) pos = 9;
        }
        
        let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado !== parseInt(digitos.charAt(0))) return false;
        
        tamanho = tamanho + 1;
        numeros = cnpj.substring(0, tamanho);
        soma = 0;
        pos = tamanho - 7;
        
        for (let i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2) pos = 9;
        }
        
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        return resultado === parseInt(digitos.charAt(1));
    }
}

// Máscaras para inputs
class InputMasks {
    static init() {
        // Máscara para CPF
        document.querySelectorAll('input[data-mask="cpf"]').forEach(input => {
            input.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
                e.target.value = value;
            });
        });
        
        // Máscara para CNPJ
        document.querySelectorAll('input[data-mask="cnpj"]').forEach(input => {
            input.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                value = value.replace(/^(\d{2})(\d)/, '$1.$2');
                value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
                value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
                value = value.replace(/(\d{4})(\d)/, '$1-$2');
                e.target.value = value;
            });
        });
        
        // Máscara para telefone
        document.querySelectorAll('input[data-mask="phone"]').forEach(input => {
            input.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length <= 10) {
                    value = value.replace(/(\d{2})(\d)/, '($1) $2');
                    value = value.replace(/(\d{4})(\d)/, '$1-$2');
                } else {
                    value = value.replace(/(\d{2})(\d)/, '($1) $2');
                    value = value.replace(/(\d{5})(\d)/, '$1-$2');
                }
                e.target.value = value;
            });
        });
        
        // Máscara para CEP
        document.querySelectorAll('input[data-mask="cep"]').forEach(input => {
            input.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                value = value.replace(/(\d{5})(\d)/, '$1-$2');
                e.target.value = value;
            });
        });
        
        // Máscara para moeda
        document.querySelectorAll('input[data-mask="currency"]').forEach(input => {
            input.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                value = (parseFloat(value) / 100).toFixed(2);
                value = value.replace('.', ',');
                value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
                e.target.value = 'R$ ' + value;
            });
        });
    }
}

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar sidebar
    window.sidebarManager = new SidebarManager();
    
    // Inicializar máscaras
    InputMasks.init();
    
    // Adicionar classe de animação aos cards
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('fade-in');
        }, index * 100);
    });
    
    // Tooltip e popover initialization
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });
});

// Exportar para uso global
window.Utils = Utils;
window.InputMasks = InputMasks;